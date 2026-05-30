# FocusFlow 🚀

FocusFlow is a cross-platform Progressive Web Application (PWA) designed to bridge the gap between static task logging and active
productivity. By using proactive, customizable notifications, it helps students and professionals meet deadlines and overcome
procrastination.

---

## 2. Features and Design of Application

## Background
* As students, we all struggle with the overwhelming amount of work and deadlines to follow. Without any aid or list, it becomes very
easy to forget and might end up overlooking some deadlines due to stress or overwork.
* Current static TO-DO lists such as calender apps do not constantly remind the user when the deadline is approaching and the student
might end up procrastinating and overlooking the deadline until the very last moment, causing them to stress over meeting deadlines
and having to pull all-nighters.
* FocusFlow is a cross-platform Progressive Web Application (PWA) designed to bridge the gap between static task logging and active
productivity. The app will not only allow users to manage their daily tasks but will implement a proactive notification system to
ensure deadlines are met, helping students and professionals overcome procrastination through timely, customizable reminders.

### Core Features
* **User Authentication (PoC Completed):** Secure login and registration system.
    * For authentication, we have decided to use Supabase for encrypted and secure login so that the information of users will not be
    compromised and that their data will remain safe.

* **Active Task Management (Planned):** Full CRUD (Create, Read, Update, Delete) capabilities for daily tasks.
    * **Create:** This operation allows users to add completely new records to a data store. In your productivity app, FocusFlow, this
    happens when a user types out a new task and clicks "Save."
    * **Read:** This operation retrieves or views existing data without modifying it. For FocusFlow, this is the action of loading the
    dashboard and displaying the user's current list of tasks.
    * **Update:** This operation modifies existing data fields within the database. Examples include changing a task's due date
    editing the description, or toggling a checkbox to mark a task as completed.
    * **Delete:** This operation permanently removes data from the system. This occurs when a user hits the trash icon to get rid of a
    task entirely.

* **Proactive Notification Engine (Planned):** Customizable, timely reminders to ensure deadlines are met before panic sets in.
    * Users will be able to customize the interval which the app will remind them (Example: Users can push notification reminders 1
    week, 24 hours, 12 hours, and 1 hour before the actual deadline)

* **Productivity Dashboard (Planned):** Visual analytics showing tasks completed vs. overdue.
    * The dashboard will show which tasks have been completed with green while those that are overdue will be marked with red. 
    Moreover, a difficulty system will be set with different colours with a priority level as well to ensure the user can properly
    delegate more of their time to tasks with higher workload or higher priority

### System Design
FocusFlow is designed as a headless PWA to ensure it runs smoothly across desktop and mobile devices. 
* **Frontend:** Built with React (Vite) for a fast, responsive user interface. 
* **Backend:** Powered by Supabase for secure user authentication and real-time database management.

---

## 3. Development Plan

Our development roadmap is split into three main phases:

* **Milestone 1: Ideation & Proof of Concept (Completed by June 1)**
    * Formulate project scope and system design.
    * Set up GitHub collaboration.
    * Build technical PoC: Integrated React frontend with a Supabase authentication backend.
* **Milestone 2: Core Functionality (Next phase)**
    * Design the main Dashboard UI.
    * Implement Task CRUD operations connected to the Supabase database.
* **Milestone 3: The Notification Engine (Final phase)**
    * Build out the customizable reminder system.
    * Bug fixing, cross-platform testing, and final deployment.

---

## 4. Documentation of System

### Tech Stack
* **Frontend Framework:** React.js (initialized via Vite)
* **Backend / Auth:** Supabase (PostgreSQL)
* **Version Control:** Git & GitHub
* **Package Manager:** npm

### How to Run the Project Locally
To run this Proof of Concept on your local machine, follow these steps:

1. Clone the repository to your local machine.
2. Open the project folder in your terminal.
3. Install the required dependencies by running:
   `npm install`
4. Start the local development server by running:
   `npm run dev`
5. Open the provided `localhost` link in your browser to view the authentication app.