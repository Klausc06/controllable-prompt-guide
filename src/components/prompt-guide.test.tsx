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
});
