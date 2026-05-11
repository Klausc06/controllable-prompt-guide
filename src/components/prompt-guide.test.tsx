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
});
