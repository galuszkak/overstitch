# Pre-Surgery Preparation App Requirements: Endoscopic Sleeve Gastroplasty (ESG)

This document outlines the user stories and non-functional requirements for a local-first, web-based application designed to help patients prepare for Endoscopic Sleeve Gastroplasty (ESG), also known as "Overstitch" surgery. The app focuses on tracking the required pre-operative dietary intake: daily Nutridrink and water consumption, as well as a daily stomach protection pill (probiotics).

## User Stories

User stories are written from the perspective of the patient preparing for ESG surgery using the app.

**Goal: Track Pre-Surgery Dietary Requirements**

*   **As a patient preparing for ESG, I want to be able to indicate when I start drinking a Nutridrink so that the app can help me consume it over the recommended time as part of my pre-op diet.**
    *   *Acceptance Criteria:* There is a clear action (e.g., a "Start Nutridrink" button) to initiate the timed consumption process. The app records the start time.
*   **As a patient, I want to receive a reminder after 10 minutes of starting a Nutridrink so that I am prompted to take another sip, ensuring I follow the consumption guidelines.**
    *   *Acceptance Criteria:* The app provides a visible or audible notification/alert 10 minutes after the "Start Nutridrink" action.
*   **As a patient, I want to receive a reminder after 20 minutes of starting a Nutridrink so that I am prompted to continue drinking as required.**
    *   *Acceptance Criteria:* The app provides a visible or audible notification/alert 20 minutes after the "Start Nutridrink" action.
*   **As a patient, I want to receive a final reminder after 30 minutes of starting a Nutridrink so that I know I should have finished it according to the pre-op plan.**
    *   *Acceptance Criteria:* The app provides a visible or audible notification/alert 30 minutes after the "Start Nutridrink" action.
*   **As a patient, I want a Nutridrink to be counted towards my daily total only after the 30-minute consumption period is completed so that the tracking accurately reflects finished bottles required for my preparation.**
    *   *Acceptance Criteria:* The daily Nutridrink count increases by one only after the 30-minute timer for a started Nutridrink has elapsed.
*   **As a patient, I want to be able to easily record when I drink water, using a default serving size (e.g., 250ml), but with the option to quickly adjust the amount (e.g., in 50ml increments) so that I can accurately track my daily hydration goal in liters.**
    *   *Acceptance Criteria:* There is a clear action (e.g., "Add Water" button). Clicking it adds the default serving size to the daily total. There are controls (e.g., +/- buttons) to adjust the amount *before* adding it, in 50ml steps. The default serving size is configurable in settings. The total water consumed is displayed in liters (e.g., 1.5 L).
*   **As a patient, I want to be able to mark that I have taken my daily stomach protection pill (probiotics) so that I can track my adherence to the pre-op medication plan.**
    *   *Acceptance Criteria:* There is a clear control (e.g., a checkbox or button) to mark the pill as taken for the current day. The app indicates that the pill has been recorded for the day. This action can only be performed once per day.
*   **As a patient, I want to see how many Nutridrinks have been completed today so that I know if I am meeting my pre-op target (e.g., 3-5).**
    *   *Acceptance Criteria:* The current day's count of *completed* Nutridrinks is prominently displayed.
*   **As a patient, I want to see how much water I have consumed today, displayed in liters, so that I know if I am meeting my pre-op hydration target (e.g., at least 2 liters).**
    *   *Acceptance Criteria:* The current day's total water consumption is prominently displayed in liters (e.g., "1.75 L").
*   **As a patient, I want to see if I have taken my stomach protection pill today so that I know if I have remembered this part of my preparation.**
    *   *Acceptance Criteria:* The app clearly indicates whether the stomach protection pill has been marked as taken for the current day.
*   **As a patient, I want to see my *completed* Nutridrink consumption for previous days so that I can review my adherence history during the preparation period.**
    *   *Acceptance Criteria:* There is a way to view past dates and their corresponding counts of completed Nutridrinks.
*   **As a patient, I want to see my water consumption for previous days, displayed in liters, so that I can review my hydration history.**
    *   *Acceptance Criteria:* There is a way to view past dates and their corresponding total water consumption in liters.
*   **As a patient, I want to see if I took my stomach protection pill on previous days so that I can review my medication adherence history.**
    *   *Acceptance Criteria:* There is a way to view past dates and see whether the stomach protection pill was marked as taken on those days.
*   **As a patient, I want to see if a Nutridrink consumption process is currently in progress and how much time is remaining so that I know when the next reminder is due or when it will be counted towards my daily goal.**
    *   *Acceptance Criteria:* When a Nutridrink is started, the app displays its status (e.g., "Nutridrink in progress") and potentially a countdown or progress indicator.

**Goal: Configure Application Settings**

*   **As a patient, I want a settings screen where I can set my preferred default water serving size (e.g., 250ml, 300ml, etc., adjustable in 50ml increments) so that when I add water, it defaults to the amount I usually drink.**
    *   *Acceptance Criteria:* There is a dedicated settings area accessible within the app. The user can select or input a default water serving size (in ml, divisible by 50). This setting is saved locally and used as the default amount when the "Add Water" action is initiated.

**Goal: Easy Interaction During Preparation**

*   **As a patient preparing for surgery, I want the process of *starting* a Nutridrink, *adding* a water serving, or *marking* the pill as taken to be very quick and require minimal steps so that I can log it easily while managing other pre-op tasks.**
    *   *Acceptance Criteria:* Each of these logging actions takes no more than two taps/clicks from the main screen. Adjusting the water amount before adding should also be quick.
*   **As a patient, I want the app's design to be simple and easy to understand so that I can use it without confusion, especially during the potentially stressful pre-surgery period.**
    *   *Acceptance Criteria:* The interface uses clear icons and labels. Key information (today's counts, pill status, active Nutridrink progress) is immediately visible on launch.
*   **As a patient, I want the reminders for Nutridrinks to be noticeable but not overly intrusive so that I am prompted effectively without adding stress.**
    *   *Acceptance Criteria:* The reminder mechanism is clear (e.g., a visual alert, perhaps an optional sound) and easy to dismiss or acknowledge.

## Non-Functional Requirements

These requirements specify constraints and quality attributes for the application.

**Technical Constraints:**

*   **Local-First Storage:** All consumption, medication tracking, and settings data must be stored directly on the device and not rely on a remote server for primary storage or operation. This will likely involve using browser-based storage mechanisms like IndexedDB or Local Storage.
*   **Web Technologies Only:** The application must be built exclusively using standard web technologies (HTML, CSS, JavaScript) and frameworks/libraries compatible with this stack (e.g., Svelte, React, Preact, Vue, with UI libraries like TailwindCSS, Shadcn, DaisyUI, etc.). The choice should prioritize rapid development, maintainability, and ease of implementation for a local-first app.
*   **iOS/iPhone Compatibility:** The app must be designed and optimized to function correctly and provide a good user experience on iOS devices, primarily iPhones, when accessed via a web browser (like Safari).
*   **No Data Egress:** No consumption data, medication tracking data, settings, or any other personal information should ever be sent outside of the user's browser to any external server or service. Privacy during the pre-operative phase is paramount.

**Usability:**

*   **Ease of Use:** The user interface must be intuitive and straightforward, prioritizing simplicity and minimizing cognitive load for the patient during their surgery preparation. Actions should be obvious and easy to perform with minimal steps.
*   **Accessibility (Consideration):** While not explicitly requested, consider basic accessibility principles to make the app usable for patients with potential visual or motor impairments (e.g., sufficient contrast, tappable areas).

**Performance:**

*   **Responsiveness:** The app should load quickly and respond promptly to user interactions, even with several days or weeks of historical data stored locally.
*   **Background Processing (Nutridrink Reminders):** The app needs a mechanism to trigger Nutridrink reminders even if the browser is not actively in the foreground. This might require exploring Web APIs like the Web Notification API and potentially Service Workers, keeping the "Web Technologies Only" constraint in mind.

**Data Handling:**

*   **Data Persistence:** All consumption, medication tracking, and settings data must persist locally on the device across app sessions (browser closures, device restarts, etc.).
*   **Data Integrity:** The app should store consumption and medication data accurately for each day, ensuring that Nutridrink counts reflect completed consumptions, water totals are accurate (stored likely in ml but displayed in L), and pill tracking is a simple daily flag.
*   **Data Storage Limits:** Be mindful of browser local storage limits, although for the typical duration of pre-op tracking, this is unlikely to be a major issue.

**Design:**

*   **Prioritize Key Information:** The main screen should immediately display today's key pre-op tracking information: completed Nutridrinks, total water consumed (in liters), and pill status.
*   **Clear Visual Feedback:** User actions (adding water, starting Nutridrink, taking pill) should have clear visual feedback to confirm the action was registered.

This document provides a comprehensive set of requirements to guide the development of the ESG pre-operative tracking app.