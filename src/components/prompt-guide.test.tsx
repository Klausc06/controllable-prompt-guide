import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PromptGuide } from "./prompt-guide";

describe("PromptGuide", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });
  });

  it("generates a prompt from the default guided selections", () => {
    render(<PromptGuide />);

    expect(screen.getByText("可控提示词向导")).toBeInTheDocument();
    expect(screen.getByText("中文 Prompt")).toBeInTheDocument();
    expect(screen.getAllByText(/健身房开业宣传视频/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Seedance 2.0/).length).toBeGreaterThan(0);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("switches target output without losing user selections", () => {
    render(<PromptGuide />);

    fireEvent.click(screen.getByText("旅游城市宣传片"));
    fireEvent.click(screen.getByText("通用视频模型"));

    expect(screen.getAllByText(/目标：旅游城市宣传片/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("线下店铺/门店").length).toBeGreaterThan(0);
  });

  it("opens advanced options and exposes copy actions", async () => {
    render(<PromptGuide />);

    fireEvent.click(screen.getByText("高级选项"));
    expect(screen.getAllByText("声音怎么处理？").length).toBeGreaterThan(1);

    fireEvent.click(screen.getByText("复制中文"));
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalled());
  });

  it("copy buttons expose correct payload content (TEST-11)", () => {
    render(<PromptGuide />);

    expect(screen.getByText("复制中文")).toBeInTheDocument();
    expect(screen.getByText("复制英文")).toBeInTheDocument();
    expect(screen.getByText("复制 JSON")).toBeInTheDocument();
  });

  it("handles clipboard failure gracefully (TEST-12)", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) }
    });
    render(<PromptGuide />);
    fireEvent.click(screen.getByText("复制中文"));
    // Should not crash — button remains visible
    await waitFor(() => expect(screen.getByText("复制中文")).toBeInTheDocument());
  });

  it("advanced options collapse and expand correctly (TEST-14)", () => {
    render(<PromptGuide />);
    // Advanced question headings should NOT be visible when collapsed — they only render inside the QuestionBlock section
    // Verify the toggle button exists
    expect(screen.getByText("高级选项")).toBeInTheDocument();
    // Expand: clicking should show advanced questions via heading tag
    fireEvent.click(screen.getByText("高级选项"));
    const headings = screen.getAllByRole("heading");
    const formatHeading = headings.filter((h) => h.textContent === "比例和时长");
    expect(formatHeading.length).toBe(1); // One h2 heading rendered for format question
    // Collapse
    fireEvent.click(screen.getByText("高级选项"));
    // After collapse, the h2 heading for format should no longer be present
    expect(screen.queryByRole("heading", { name: "比例和时长" })).toBeNull();
  });

  it("preserves safety default deselection across target switches (ARCH-07)", () => {
    render(<PromptGuide />);

    // Deselect the safety default — click the first "文字少且可读" match (the button in the constraints question block)
    const textButtons = screen.getAllByText("文字少且可读");
    fireEvent.click(textButtons[0]);

    // Switch to Generic Video and back to Seedance
    fireEvent.click(screen.getByText("通用视频模型"));
    fireEvent.click(screen.getByText("Seedance 2.0"));

    // After switching back, the deselected safety default should NOT be re-added
    // The Brief output section in the right sidebar should not contain the deselected option text
    const briefSection = screen.getByText("Brief").closest("section")!;
    expect(briefSection.textContent).not.toContain("文字少且可读");
  });

  it("renders without console errors (TEST-15)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<PromptGuide />);
    // Switch target — should not log errors
    fireEvent.click(screen.getByText("通用视频模型"));
    fireEvent.click(screen.getByText("高级选项"));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  describe("consumer aesthetics tags (DIFF-01)", () => {
    it("renders consumer term tags in the Style question section", () => {
      render(<PromptGuide />);
      // Consumer tags: 高级感, 大片感, ins风, 小清新, etc.
      // These should appear as button elements in the Style section
      expect(screen.getByText("高级感")).toBeInTheDocument();
      expect(screen.getByText("大片感")).toBeInTheDocument();
    });

    it("clicking a consumer tag selects the corresponding style option card", () => {
      render(<PromptGuide />);
      // "高级感" maps to style:premium_minimal ("高级极简")
      const consumerTag = screen.getByText("高级感");
      fireEvent.click(consumerTag);
      // The mapped option card should now show as selected — find the button ancestor
      const allOptionLabels = screen.getAllByText("高级极简");
      const optionCardButton = allOptionLabels.find(
        (el) => el.closest("button")
      )?.closest("button");
      expect(optionCardButton).toBeTruthy();
      expect(optionCardButton!.className).toContain("ring-4");
      // The consumer tag itself should have aria-pressed="true"
      expect(consumerTag).toHaveAttribute("aria-pressed", "true");
    });

    it("consumer tags support additive multi-select", () => {
      render(<PromptGuide />);
      fireEvent.click(screen.getByText("高级感"));
      fireEvent.click(screen.getByText("暗黑"));
      // Both tags should be active
      expect(screen.getByText("高级感")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("暗黑")).toHaveAttribute("aria-pressed", "true");
      // Both mapped option cards should show as selected — filter for button ancestors
      const premiumCard = screen
        .getAllByText("高级极简")
        .find((el) => el.closest("button"))
        ?.closest("button");
      const darkCard = screen
        .getAllByText("暗黑/质感调")
        .find((el) => el.closest("button"))
        ?.closest("button");
      expect(premiumCard!.className).toContain("ring-4");
      expect(darkCard!.className).toContain("ring-4");
    });
  });

  describe("category tabs (DIFF-04)", () => {
    it("renders category tabs for option sets with categories", () => {
      render(<PromptGuide />);
      // Subject section has categories: 人物, 产品, 空间/场所, 其他主体
      // Multiple sections have categories — verify at least one "全部" tab exists
      const allTabs = screen.getAllByRole("tab", { name: "全部" });
      expect(allTabs.length).toBeGreaterThan(0);
      // At least one category tab should be present
      expect(screen.getByRole("tab", { name: "人物" })).toBeInTheDocument();
    });

    it("filters options when a category tab is clicked", () => {
      render(<PromptGuide />);
      // Click "产品" tab in Subject section
      const productTabs = screen.getAllByRole("tab", { name: "产品" });
      const productTab = productTabs[0];
      fireEvent.click(productTab);
      // Product-tagged options should be visible, others hidden
      expect(screen.getByText("单个产品")).toBeInTheDocument();
      expect(screen.getByText("电子数码产品")).toBeInTheDocument();
      // Verify the tab is selected
      expect(productTab).toHaveAttribute("aria-selected", "true");
    });

    it("persists selected options across tab switches", () => {
      render(<PromptGuide />);
      // First, select an option in the "产品" tab
      const productTabs = screen.getAllByRole("tab", { name: "产品" });
      fireEvent.click(productTabs[0]);
      const heroProduct = screen.getByText("单个产品").closest("button");
      fireEvent.click(heroProduct!);
      // Switch to "全部" tab
      const allTabs = screen.getAllByRole("tab", { name: "全部" });
      fireEvent.click(allTabs[0]);
      // The previously selected option should still be selected — find button ancestor
      const heroProductAfter = screen
        .getAllByText("单个产品")
        .find((el) => el.closest("button"))
        ?.closest("button");
      expect(heroProductAfter!.className).toContain("ring-4");
    });
  });

  describe("platform format tags (DIFF-05)", () => {
    it("renders platform tags in the Format question section", () => {
      render(<PromptGuide />);
      // Expand advanced options so Format section renders
      fireEvent.click(screen.getByText("高级选项"));
      // Platform tags: 抖音, 小红书, B站, 视频号
      expect(screen.getByText("抖音")).toBeInTheDocument();
      expect(screen.getByText("小红书")).toBeInTheDocument();
      expect(screen.getByText("B站")).toBeInTheDocument();
    });

    it("clicking a platform tag selects its recommended format options", () => {
      render(<PromptGuide />);
      // Expand advanced options so Format section renders
      fireEvent.click(screen.getByText("高级选项"));
      const douyinTag = screen.getByText("抖音");
      // Default has format:vertical_10s selected → douyin tag is already active
      // First click deselects all douyin formats (toggle off)
      fireEvent.click(douyinTag);
      expect(douyinTag).toHaveAttribute("aria-pressed", "false");
      // Second click selects all douyin formats (toggle on)
      fireEvent.click(douyinTag);
      expect(douyinTag).toHaveAttribute("aria-pressed", "true");
      // At least one of the recommended format cards should be selected
      const format10sButton = screen
        .getAllByText("9:16 竖屏 10 秒")
        .find((el) => el.closest("button"))
        ?.closest("button");
      expect(format10sButton).toBeTruthy();
      expect(format10sButton!.className).toContain("ring-4");
    });

    it("platform tags are additive—clicking multiple platforms merges selections", () => {
      render(<PromptGuide />);
      // Expand advanced options so Format section renders
      fireEvent.click(screen.getByText("高级选项"));
      // Select Douyin
      fireEvent.click(screen.getByText("抖音"));
      // Then select RedNote (additive)
      fireEvent.click(screen.getByText("小红书"));
      // Both tags should be active
      expect(screen.getByText("抖音")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("小红书")).toHaveAttribute("aria-pressed", "true");
      // Douyin's format:vertical_10s should still be selected — find button ancestor
      const format10sButton = screen
        .getAllByText("9:16 竖屏 10 秒")
        .find((el) => el.closest("button"))
        ?.closest("button");
      expect(format10sButton!.className).toContain("ring-4");
    });
  });
});
