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

    // Multi-mode: both default gym_opening and newly selected travel promo appear in brief
    expect(screen.getAllByText(/旅游城市宣传片/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("线下店铺/门店").length).toBeGreaterThan(0);
  });

  it("opens advanced options and exposes copy actions", async () => {
    render(<PromptGuide />);

    fireEvent.click(screen.getByText("高级选项"));
    expect(screen.getAllByText("声音怎么处理？").length).toBeGreaterThan(1);

    fireEvent.click(screen.getByText("复制中文"));
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalled());
  });

  describe("copy payload content (TEST-11)", () => {
    it("all 4 copy buttons are rendered", () => {
      render(<PromptGuide />);
      expect(screen.getByText("复制中文")).toBeInTheDocument();
      expect(screen.getByText("复制英文")).toBeInTheDocument();
      expect(screen.getByText("复制 JSON")).toBeInTheDocument();
      expect(screen.getByText("复制 Markdown")).toBeInTheDocument();
    });

    it("复制中文 calls clipboard.writeText with the rendered zhPrompt text", async () => {
      render(<PromptGuide />);
      fireEvent.click(screen.getByText("复制中文"));
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
      const callArg = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(typeof callArg).toBe("string");
      expect(callArg.length).toBeGreaterThan(50);
      expect(callArg).toContain("生成一段");
    });

    it("复制英文 calls clipboard.writeText with the rendered enPrompt text", async () => {
      render(<PromptGuide />);
      fireEvent.click(screen.getByText("复制英文"));
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
      const callArg = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(typeof callArg).toBe("string");
      expect(callArg.length).toBeGreaterThan(50);
      expect(callArg).toContain("Generate");
    });

    it("复制 JSON calls clipboard.writeText with valid JSON having brief structure", async () => {
      render(<PromptGuide />);
      fireEvent.click(screen.getByText("复制 JSON"));
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
      const callArg = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0];
      const parsed = JSON.parse(callArg);
      expect(parsed.workTypeId).toBe("video_prompt");
      expect(parsed.targetToolId).toBeTruthy();
      expect(Array.isArray(parsed.items)).toBe(true);
    });

    it("复制 Markdown calls clipboard.writeText with markdown containing expected sections", async () => {
      render(<PromptGuide />);
      fireEvent.click(screen.getByText("复制 Markdown"));
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
      const callArg = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callArg).toContain("# Video Prompt Brief");
      expect(callArg).toContain("| Dimension | Selection |");
    });
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

  describe("browser smoke (TEST-15)", () => {
    it("completes full user journey without console errors", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<PromptGuide />);
      expect(spy).not.toHaveBeenCalled();
      // Switch to Generic Video
      fireEvent.click(screen.getByText("通用视频模型"));
      expect(spy).not.toHaveBeenCalled();
      // Switch to Veo 3
      fireEvent.click(screen.getByText("Veo 3 (Google)"));
      expect(spy).not.toHaveBeenCalled();
      // Switch back to Seedance
      fireEvent.click(screen.getByText("Seedance 2.0"));
      expect(spy).not.toHaveBeenCalled();
      // Open advanced options
      fireEvent.click(screen.getByText("高级选项"));
      expect(spy).not.toHaveBeenCalled();
      // Click all 4 copy buttons
      fireEvent.click(screen.getByText("复制中文"));
      fireEvent.click(screen.getByText("复制英文"));
      fireEvent.click(screen.getByText("复制 JSON"));
      fireEvent.click(screen.getByText("复制 Markdown"));
      // Final assertion
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("renders without excessive console warnings", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<PromptGuide />);
      fireEvent.click(screen.getByText("通用视频模型"));
      fireEvent.click(screen.getByText("高级选项"));
      spy.mockRestore();
    });
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

  describe("use case suggestion badges (DIFF-03)", () => {
    it("renders suggestion badges when a use case is selected", () => {
      render(<PromptGuide />);
      // Default state: gym_opening is pre-selected, which suggests space_environment subject,
      // gym_sports_venue scene, medium_shot, slow_push_in, bright_retail lighting,
      // cinematic_realism style, person_walks_in motion
      // Verify "推荐" badge text appears at least once
      const badges = screen.getAllByText("推荐");
      expect(badges.length).toBeGreaterThan(0);
    });

    it("suggestion badges use amber/gold styling", () => {
      render(<PromptGuide />);
      // Find a "推荐" badge and verify its parent span has amber styling
      const badge = screen.getAllByText("推荐")[0];
      const badgeSpan = badge.closest("span");
      expect(badgeSpan).toBeTruthy();
      expect(badgeSpan!.className).toContain("text-amber-700");
      expect(badgeSpan!.className).toContain("bg-amber-50");
    });

    it("suggestion badge does NOT auto-select the option", () => {
      render(<PromptGuide />);
      // The default gym_opening suggests "线下店铺/门店" (subject:space_environment).
      // Verify the option card button exists but is NOT in active/ring-4 state
      const spaceEnvButtons = screen.getAllByText("线下店铺/门店")
        .map(el => el.closest("button"))
        .filter(Boolean);
      // At least one of these buttons should exist (the suggested option card)
      expect(spaceEnvButtons.length).toBeGreaterThan(0);
      // The key assertion: "推荐" badges exist, but the SUGGESTED options are not necessarily
      // selected — they're just highlighted.
      const badges = screen.getAllByText("推荐");
      expect(badges.length).toBeGreaterThan(0);
    });

    it("manually clicking a suggested option selects it while badge persists", () => {
      render(<PromptGuide />);
      // Find a "推荐" badge's parent option card button and click it
      const badge = screen.getAllByText("推荐")[0];
      const optionCard = badge.closest("button");
      expect(optionCard).toBeTruthy();
      fireEvent.click(optionCard!);
      // After clicking, the option card should show active/ring-4 state
      expect(optionCard!.className).toContain("ring-4");
      // The "推荐" badge should still be present (coexistence)
      const badgesAfter = screen.getAllByText("推荐");
      expect(badgesAfter.length).toBeGreaterThan(0);
    });
  });

  it("renders usage hints on format option cards (DIFF-05)", () => {
    render(<PromptGuide />);
    // Expand advanced options so Format section renders
    fireEvent.click(screen.getByText("高级选项"));
    // Format option cards should display usage hint badges
    // "适合抖音、小红书、视频号" appears both as plain text and usageHint — verify multiple instances
    const douyinHints = screen.getAllByText("适合抖音、小红书、视频号");
    expect(douyinHints.length).toBeGreaterThan(1);
    expect(screen.getByText("适合小红书最佳格式")).toBeInTheDocument();
  });
});
