# Overlay navigation lifecycle

| Field | Value |
| --- | --- |
| **Status** | Approved navigation principles, partial implementation |
| **Updated** | 2026-11-27 |
| **Evidence** | [Mobile audit](../audits/mobile-ui-ux-audit.md) · [Phase 1](https://github.com/WanderingImmortal/tales-immortal-path/pull/264) |

## Approved navigation principles

The developer approved these principles for Phase 2 on 2026-11-27.

- Back reverses the latest navigation step. Gameplay actions, costs, elapsed time and settlement stay with their existing action handlers.
- A nested interface returns to its immediate parent and restores focus to its launcher or a control in that parent.
- Mandatory choices retain their protections. A protected parent can have a dismissible child.
- Active committed activities keep their explicit controls, including Pause and Emerge during seclusion.
- Close runs the surface's intended cleanup exactly once. Navigation does not add world advancement, persistence or a second gameplay callback.
- Desktop Escape, phone Back and explicit Return follow the same parent relationships. Presentation can differ by viewport.

World, Cultivation and Character are intended to become distinct primary workspaces in a later mobile redesign. Surface navigation is session UI state and can be used by a workspace as well as a dialog. Browser and operating system history integration is a separate design decision.

## Phase 2 implementation

[`overlay-navigation.js`](../../overlay-navigation.js) keeps an in-memory stack of surfaces, opener elements, parent links, dismissal policy and cleanup callbacks. `openOverlaySurface` can suspend a managed parent while preserving its DOM and scroll position. `closeOverlaySurface` removes the stack entry before invoking cleanup, then resumes a suspended parent and restores focus. A gameplay transition can discard that branch. That path is used when Dantian hands off to tribulation.

The navigator tracks map layers and local destination previews as UI steps. Back restores the previous view and its scroll position. **Close Map** closes the entire map. Successful travel discards the previous map steps. The map uses a fixed header and tabs with a bounded scrolling body. The hub, chambers and smaller dialogs use the shared panel and scroll classes with their existing theme and presentation.

Escape and the phone Back button both dismiss the top surface through the stack. Existing popup roots register their visibility through a compatibility observer. That path respects their visual layering and uses their existing safe close handlers. Protected or unclassified popups have no generic closer. Combat, tribulation, transcendence, tutorial decisions, active seclusion and explicit settlement prompts keep their own controls. A breakthrough style chooser can still be canceled before committing.

Managed dialogs have accessible names, initial focus and keyboard containment. Parent panels are inert while an active modal child covers them. Scroll lock and the clock and lifespan indicators update through presentation functions. Calendar hold rules continue to read the existing active overlays. Neither the stack nor its map history is persisted.

### Migrated interfaces

- Three Refinements, Dantian Chamber, Body Chamber and Soul Palace.
- World, Region, Local and Sect map layers, including the phone World action sheet as a parent.
- Phone action sheets, Cultivation Stats, Diary, Techniques and action help. Techniques can close independently during combat.

### Remaining coverage and decisions

- Inventory and its forge handoff, map shortcuts to Market, Factions and NPCs, quest and encounter chains, workshop panels, section-level tabs, and combat or ritual layouts still have legacy entry points. Migrate their cleanup and focus when those flows are reviewed.
- Previous proposals to reset sub-tabs to a default on the first Escape are superseded by navigation history for the map. Decide what constitutes a navigation step in other multi-view interfaces as they are migrated.
- Workspace boundaries, browser or operating system Back behavior, and any ability to minimize a committed activity require developer review. Phone mode remains opt-in.
- The browser suites exercise Chromium touch emulation and desktop keyboard interaction. Screen readers, operating system gestures and physical devices remain separate verification work.
