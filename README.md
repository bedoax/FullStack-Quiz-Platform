# Quiz Platform

A full-stack, role-based **Quiz and Assessment Platform** designed for students, teachers, and administrators.

The platform allows teachers to create and manage quizzes, build question banks, select questions manually or randomly, organize questions by topics, monitor student performance, and publish assessments. Students can take timed quizzes, submit attempts, review their results, and track their performance. Administrators manage users, teachers, roles, topics, quizzes, and questions at the system level.

The project was built with a strong focus on **security, maintainability, performance, clear separation of responsibilities, and responsive user experience**.

---

## Table of Contents

* [Overview](#overview)
* [Core Capabilities](#core-capabilities)
* [Roles and Responsibilities](#roles-and-responsibilities)
* [Application Workflow](#application-workflow)
* [Teacher Workflow](#teacher-workflow)
* [Student Workflow](#student-workflow)
* [Admin Workflow](#admin-workflow)
* [Question Selection System](#question-selection-system)
* [Quiz Availability and Scheduling](#quiz-availability-and-scheduling)
* [Authentication and Security](#authentication-and-security)
* [Performance and Resource Management](#performance-and-resource-management)
* [Architecture](#architecture)
* [Frontend Architecture](#frontend-architecture)
* [Backend Architecture](#backend-architecture)
* [Data and Pagination Strategy](#data-and-pagination-strategy)
* [Navigation and Layout](#navigation-and-layout)
* [Validation and Error Handling](#validation-and-error-handling)
* [Responsive UI](#responsive-ui)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [API Design](#api-design)
* [Important Design Decisions](#important-design-decisions)
* [Future Improvements](#future-improvements)
* [Getting Started](#getting-started)

---

# Overview

Quiz Platform is built around three main user roles:

```text
                    ┌─────────────────┐
                    │      Admin      │
                    │ System Manager  │
                    └────────┬────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
               ▼                           ▼
        ┌──────────────┐            ┌──────────────┐
        │   Teacher    │            │   Student    │
        │ Content/User │            │ Quiz/Results │
        │ Management   │            │   Learning   │
        └──────┬───────┘            └──────┬───────┘
               │                           │
               └─────────────┬─────────────┘
                             ▼
                    ┌─────────────────┐
                    │      Quizzes    │
                    │ Questions/Topics│
                    │ Attempts/Results│
                    └─────────────────┘
```

The system separates responsibilities clearly:

* **Admins manage the platform itself.**
* **Teachers create and manage educational content.**
* **Students consume the content and generate assessment results.**

---

# Core Capabilities

## Authentication

* User registration and login.
* Role-based authorization.
* Access token authentication.
* Refresh token flow using secure `HttpOnly` cookies.
* Automatic access-token refresh.
* Google Sign-In.
* Google-only account handling.
* Protected frontend routes.
* Protected backend endpoints.

## Quiz Management

Teachers can:

* Create quizzes.
* Edit quizzes.
* Save quizzes as drafts.
* Publish quizzes.
* Unpublish quizzes.
* Configure maximum attempts.
* Configure pass percentage.
* Configure quiz duration.
* Configure availability dates.

## Question Bank

Teachers can:

* Create questions.
* Edit questions.
* Assign questions to topics.
* Configure difficulty.
* Configure points.
* Browse questions using pagination.
* Filter questions by topic.

## Quiz Question Builder

Teachers can build a quiz using several strategies:

### Manual Selection

Select individual questions manually.

### Topic Filtering

Filter available questions by topic before selecting them.

### Random Selection

Select a requested number of questions randomly.

Random selection can be performed:

* From all available questions.
* From questions belonging to a selected topic.

### Duplicate Prevention

Questions already assigned to a quiz are excluded from the selectable question pool.

This keeps the question-selection experience clean and prevents accidental duplication.

---

# Roles and Responsibilities

## Admin

The Admin acts as the system administrator.

### Dashboard

* View system-level statistics.

### Students

* View students.
* Delete or manage student accounts according to the configured account lifecycle rules.

### Teachers

* Create teacher accounts.
* View teachers.
* Activate / deactivate teacher accounts.

Teacher account creation is intentionally restricted to administrators to reduce uncontrolled access to the Teacher role.

### Roles

Full role management:

* Create.
* View.
* Update.
* Delete.

### Topics

* View.
* Delete.

### Questions

* View.
* Delete.

Admins do not create or edit educational questions.

### Quizzes

* View.
* Delete.

Admins do not create or edit teacher-owned quizzes.

### Leaderboard

* View leaderboard data.

### Profile

* View and update the administrator profile.

---

# Teacher

The Teacher owns and manages educational content.

## Teacher Dashboard

The dashboard provides teacher-oriented statistics such as:

* Number of quizzes.
* Number of questions.
* Number of students.
* Average pass rate.

## Quizzes

Teachers can:

* Create quizzes.
* Edit quizzes.
* Publish or unpublish quizzes.
* Manage quiz availability.
* Add questions.
* View students who attempted a quiz.
* View attempts.
* View quiz statistics.

## Questions

Teachers can:

* Create questions.
* Update questions.
* Assign topics.
* Set difficulty.
* Set points.
* Browse questions using pagination.

## Students

The Teacher does not need a separate global student-management page for the current scope.

Instead, students are accessed in the context of a quiz:

```text
Quizzes
   │
   └── Select Quiz
          │
          └── View Students
```

This keeps student information contextual to the assessment where it is relevant.

---

# Student

Students are primarily assessment consumers.

## Student Dashboard

Students can view their learning and assessment information.

## Quizzes

Students can:

* View available quizzes.
* Check quiz availability.
* Start an attempt.
* Continue an active attempt.
* Complete an attempt.
* View their results.
* Review completed attempts.

## Attempts

The system tracks quiz attempts, including:

* Attempt number.
* Start time.
* End time.
* Submission state.
* Score.
* Pass/fail result.

## Leaderboard

Students can view leaderboard information.

## Profile

Students can view and update their profile information.

---

# Application Workflow

The complete assessment lifecycle is:

```text
Teacher Login
     │
     ▼
Create Quiz
     │
     ▼
Quiz starts as Draft
     │
     ▼
Create Questions
     │
     ▼
Filter / Select / Randomize Questions
     │
     ▼
Assign Questions to Quiz
     │
     ▼
Configure Quiz
     │
     ├── Duration
     ├── Attempts
     ├── Pass Percentage
     ├── Available From
     └── Available To
     │
     ▼
Publish Quiz
     │
     ▼
Student sees Quiz when available
     │
     ▼
Start Attempt
     │
     ▼
Answer Questions
     │
     ▼
Submit Attempt
     │
     ▼
Calculate Result
     │
     ├── Score
     ├── Percentage
     └── Passed / Failed
     │
     ▼
Teacher can monitor performance
```

---

# Teacher Workflow

## 1. Create Quiz

The teacher creates a quiz with configurable properties:

```text
Title
Description
Maximum Attempts
Pass Percentage
Duration
Available From
Available To
Published / Draft
```

A quiz does not have to be published immediately.

---

## 2. Build the Question Pool

Teachers create questions independently from the quiz.

Each question can have:

```text
Content
Topic
Difficulty
Points
Teacher Owner
```

---

## 3. Add Questions to a Quiz

The quiz question builder supports:

```text
All Questions
      │
      ├── Manual Selection
      │
      ├── Topic Filter → Manual Selection
      │
      ├── Random Selection
      │
      └── Topic Filter → Random Selection
```

Questions already attached to the selected quiz are automatically excluded from the available question pool.

---

## 4. Publish

The teacher can move the quiz between:

```text
Draft
  ⇅
Published
```

This allows the teacher to prepare the assessment completely before making it available to students.

---

# Question Selection System

The question-selection system is one of the main workflow improvements in the platform.

## Server-side filtering

Instead of downloading every teacher question and filtering them in the browser, the backend performs the filtering.

For example:

```text
Teacher Questions
       │
       ▼
Questions not already in Quiz
       │
       ▼
Optional Topic Filter
       │
       ▼
Pagination
       │
       ▼
Question DTOs
```

This reduces unnecessary data transfer and frontend processing.

## Optional Topic Filter

`topicId` is optional.

```text
topicId = null
    → all available questions

topicId = 5
    → only questions belonging to topic 5
```

The same endpoint can therefore support both use cases.

## Pagination

Question selection uses a paginated result:

```json
{
  "items": [],
  "page": 1,
  "size": 10,
  "totalCount": 50,
  "totalPages": 5
}
```

This keeps the interface responsive even when the question bank becomes large.

## Preserving Selection

Selected question IDs are maintained independently from the currently visible page.

That means:

```text
Page 1
  Question 1 ✓
  Question 3 ✓

      ↓ Next page

Page 2
  Question 15 ✓

Selection:
{ 1, 3, 15 }
```

Changing pages does not lose previous selections.

---

# Quiz Availability and Scheduling

Quiz availability is controlled using:

```text
AvailableFrom
AvailableTo
```

The system checks whether the current time is inside the configured availability window.

Conceptually:

```text
AvailableFrom <= CurrentTime <= AvailableTo
```

Optional dates allow quizzes to remain unrestricted when no availability boundaries are configured.

Date/time handling is standardized around **UTC** so the frontend and backend use a consistent point in time.

The frontend converts between:

```text
UTC
  ↓
Local datetime-local input
  ↓
UTC
```

This avoids manually hardcoding a timezone offset in the application.

---

# Authentication and Security

Security was treated as a core part of the platform rather than an afterthought.

## Role-based Authorization

Both frontend navigation and backend endpoints are protected by role.

Example:

```text
Admin
 └── Admin endpoints

Teacher
 └── Teacher endpoints

Student
 └── Student endpoints
```

Backend authorization remains the final authority.

Frontend route protection exists for user experience and navigation control, but it is not treated as a security boundary.

---

## Refresh Token Security

Refresh tokens are stored in an `HttpOnly` cookie rather than exposed to JavaScript.

The frontend primarily works with the authentication state while the refresh mechanism relies on the secure cookie.

This reduces unnecessary exposure of the refresh token to client-side JavaScript.

---

## Authentication State

Authentication state is centralized in the Auth Store.

The application stores the authentication state under a single `auth` local-storage entry rather than maintaining separate `token` and `user` stores.

The authentication store contains data such as:

```text
Access Token
Refresh Token State
Access Token Expiration
Refresh Token Expiration
User ID
Email
Username
Role
```

The Axios client reads authentication information through the Auth Store rather than accessing individual local-storage tokens directly.

---

## Automatic Token Refresh

The Axios layer handles:

```text
Request
   │
   ▼
401 Unauthorized
   │
   ▼
Refresh Token Request
   │
   ▼
Update Auth State
   │
   ▼
Retry Original Request
```

A shared refresh state is used so multiple requests that fail around the same time do not unnecessarily trigger multiple refresh operations.

---

## Google Sign-In

The platform supports Google authentication.

The authentication flow can:

* Validate a Google identity token.
* Find an existing account by Google ID.
* Link Google authentication to an existing account when appropriate.
* Create a new account when necessary.

For Google-only accounts, password-specific flows are handled separately so users are not incorrectly treated as password-authenticated accounts.

---

# Performance and Resource Management

Several performance-focused improvements were implemented.

## Pagination

Pagination is used for potentially large datasets such as:

* Questions.
* Teacher question banks.
* Administrative lists.
* Other large query results.

Instead of:

```text
Load everything
     ↓
Send everything
     ↓
Filter locally
```

the application uses:

```text
Request page
     ↓
Database query
     ↓
Return only required records
```

---

## Cancellation-aware Requests

The application uses request cancellation for pages and operations where continuing a request after the user leaves the page is unnecessary.

Frontend:

```text
Component
   │
   ▼
AbortController
   │
   ▼
Cancelled request
```

Backend:

```text
HTTP Request
   │
   ▼
CancellationToken
   │
   ▼
Database query
```

This is especially useful for expensive queries or pages that can be left before a request completes.

---

## Server-side Filtering

Filtering is performed on the backend whenever practical.

For example, the question-selection endpoint can filter by:

```text
Teacher
+
Quiz
+
Optional Topic
```

before pagination is applied.

This prevents unnecessary records from being transferred to the browser.

---

# Architecture

The project follows a layered full-stack architecture.

```text
┌───────────────────────────────────────────────┐
│                   Frontend                    │
│                                               │
│ Views → Components → Stores → Services → API │
└──────────────────────────┬────────────────────┘
                           │ HTTP
                           ▼
┌───────────────────────────────────────────────┐
│                    Backend                    │
│                                               │
│ Controllers → Services → UnitOfWork/Repos    │
│                          ↓                    │
│                       EF Core                 │
└──────────────────────────┬────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ SQL Server  │
                    └─────────────┘
```

The separation allows each layer to focus on a specific responsibility.

---

# Frontend Architecture

The frontend is built with Vue 3.

## Views

Views represent complete screens and pages.

Examples include:

```text
DashboardView
QuizzesView
QuestionsView
TeacherQuizStudentsView
ProfileView
LeaderboardView
```

Views coordinate page-level state, navigation, and component composition.

---

## Components

Components represent reusable UI units.

Examples:

```text
TeacherQuizCard
CreateQuizCard
EditQuizCard
AddQuestionsToQuizCard
QuestionSelectionCard
```

Complex operations are split into dedicated components instead of placing everything inside one large page component.

---

## Stores

Pinia stores manage shared application state.

For example, the Teacher Store handles shared teacher-related data such as:

```text
Dashboard
Quizzes
Questions
Students
Attempts
Statistics
Topics
Loading State
```

---

## Services

Service modules isolate API communication from UI code.

Examples:

```text
authService
quizService
teacherService
topicService
roleService
questionService
```

A component should not need to know how an HTTP request is constructed.

Instead:

```text
Component
   ↓
Service
   ↓
Axios API client
   ↓
Backend
```

---

## Axios API Layer

The shared Axios instance is responsible for common HTTP concerns such as:

* Adding the access token.
* Handling `401`.
* Refreshing authentication.
* Retrying requests.
* Handling authorization errors.

This keeps authentication infrastructure out of individual components.

---

# Backend Architecture

The backend is built using ASP.NET Core Web API.

## Controllers

Controllers expose HTTP endpoints and handle:

* Routing.
* Authorization.
* Request binding.
* Basic request validation.
* Calling services.
* Returning HTTP responses.

---

## Services

Business rules belong in the service layer.

Examples include:

* Quiz creation.
* Quiz updates.
* Publishing rules.
* Question assignment.
* Attempt processing.
* Statistics.
* Teacher-specific logic.

---

## Repositories

Repositories handle data-access concerns.

For example, the quiz-question repository can query:

```text
Questions created by the teacher
AND
Questions not already assigned to the selected quiz
AND
Optional Topic filter
```

This keeps database-query logic separate from controller and UI logic.

---

## Unit of Work

The backend uses a Unit of Work approach to coordinate repository access and database changes.

This provides a central abstraction around data operations.

---

## DTOs

DTOs are used to control the shape of API requests and responses.

Examples:

```text
QuizCreateDto
QuizUpdateDto
TeacherQuizDto
QuestionDto
QuizStudentDto
PaginatedResult<T>
```

This prevents exposing database entities directly when a dedicated API contract is more appropriate.

---

# Data and Pagination Strategy

Pagination responses follow a common contract:

```csharp
public class PaginatedResult<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public int Page { get; set; }
    public int Size { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}
```

This allows the frontend to build a consistent pagination experience across different resources.

Example:

```text
TotalCount = 47
Size       = 10

TotalPages = 5
```

The calculation is based on the total number of records divided by the requested page size.

---

# Navigation and Layout

The platform uses role-specific layouts and navigation.

## Admin

```text
Dashboard
Students
Teachers
Roles
Topics
Questions
Quizzes
Leaderboard
Profile
```

## Teacher

```text
Dashboard
Quizzes
Leaderboard
Profile
```

Teacher-specific student information is accessed through the relevant quiz rather than maintaining a duplicated global student page.

## Student

```text
Dashboard
Topics
Quizzes
Attempts
Leaderboard
Profile
```

The navigation system is integrated with route authorization so users are directed to the appropriate dashboard for their role.

---

# Validation and Error Handling

Validation exists on both frontend and backend.

## Quiz Validation

Examples include:

* Title length.
* Description length.
* Maximum attempts range.
* Pass percentage range.
* Duration validity.
* Availability date ordering.

The system prevents invalid availability configurations such as:

```text
AvailableTo <= AvailableFrom
```

---

## Frontend UX States

The application provides dedicated states for:

```text
Loading
Empty
Error
Success
Disabled / Saving
```

For example:

```text
Loading questions...

No questions found.

Failed to load questions.

Saving...
```

This avoids silent failures and provides clear feedback to users.

---

# Responsive UI

The interface is responsive across:

* Desktop.
* Tablet.
* Mobile.

Responsive behavior was applied to:

* Navigation.
* Sidebar.
* Cards.
* Forms.
* Modals.
* Question lists.
* Pagination.
* Action buttons.

The application is designed so core workflows remain usable on smaller screens rather than relying on a desktop-only layout.

---

# Technology Stack

## Frontend

* Vue 3
* Composition API
* Vue Router
* Pinia
* Axios
* Vite
* Lucide Vue icons

## Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* SQL Server
* JWT authentication
* ASP.NET Core Authorization

## Security / Infrastructure Concepts

* Role-Based Access Control
* HttpOnly Cookies
* Access Token Refresh
* Axios Interceptors
* CancellationToken
* AbortController

---

# Project Structure

A simplified structure looks like:

```text
Project
│
├── Backend
│   ├── Api
│   │   └── Controllers
│   │
│   ├── Business
│   │   ├── Interfaces
│   │   ├── Services
│   │   └── Helpers
│   │
│   ├── Data
│   │   ├── Repositories
│   │   ├── UnitOfWork
│   │   └── DbContext
│   │
│   └── Models
│       └── DTOs
│
└── Frontend
    ├── src
    │   ├── api
    │   ├── components
    │   ├── composables
    │   ├── router
    │   ├── services
    │   ├── stores
    │   └── views
    │
    └── ...
```

The exact folder naming can differ between environments, but the responsibilities remain separated.

---

# API Design

The API is organized around resource ownership and role responsibilities.

Examples:

## Quiz Management

```http
POST   /api/Quizzes
PUT    /api/Quizzes/{id}
DELETE /api/Quizzes/{id}
```

## Quiz Questions

```http
POST /api/Quizzes/{quizId}/add-questions
```

## Teacher Questions

```http
GET /api/Teachers/questions/not-in-quiz
```

With optional filtering:

```http
GET /api/Teachers/questions/not-in-quiz
    ?quizId=20
    &topicId=5
    &page=1
    &size=10
```

## Quiz Students

```http
GET /api/Teachers/quizzes/{quizId}/students
```

## Roles

```http
GET    /api/Roles
GET    /api/Roles/{id}
POST   /api/Roles
PUT    /api/Roles/{id}
DELETE /api/Roles/{id}
```

## Authentication

The frontend communicates with authentication endpoints through the centralized authentication service.

---

# Important Design Decisions

## 1. Admin is not a Content Creator

The Admin is responsible for platform governance.

Teachers own educational content.

This keeps responsibilities clear:

```text
Admin
 └── Manage platform

Teacher
 └── Manage content

Student
 └── Consume content
```

---

## 2. Teacher accounts are controlled by Admins

Teacher account creation is intentionally restricted.

This reduces uncontrolled creation of privileged educational accounts.

---

## 3. Quiz Questions belong to the Quiz through a relation

The system uses the quiz-question relationship to determine whether a question is already assigned.

This provides a clean way to:

* Prevent duplicates.
* Filter available questions.
* Build random question pools.
* Maintain quiz composition.

---

## 4. Filtering happens before pagination

For example:

```text
Teacher Questions
        ↓
Remove questions already in Quiz
        ↓
Apply Topic Filter
        ↓
Count
        ↓
Skip / Take
```

This ensures pagination represents the actual filtered dataset.

---

## 5. Draft and Published are separate states

Teachers can prepare assessments without immediately exposing them to students.

```text
Draft
  ↓
Configure
  ↓
Add Questions
  ↓
Publish
```

---

## 6. UTC is the system-wide time standard

The application avoids mixing local time and UTC in backend comparisons.

UTC is used as the canonical representation while the frontend converts values for local UI controls.

---

## 7. Backend authorization is authoritative

Frontend route restrictions improve UX, but backend authorization is responsible for actual access control.

A user cannot gain permission simply by modifying the frontend.

---

# Additional Improvements

Beyond the main CRUD and assessment functionality, the project includes several engineering improvements.

## Security Improvements

* Reduced sensitive data stored in browser storage.
* Refresh tokens moved to `HttpOnly` cookies.
* Centralized authentication state.
* Role-specific route protection.
* Protected backend endpoints.
* Google authentication support.

## Performance Improvements

* Pagination.
* Server-side filtering.
* Query-level projection to DTOs.
* Cancellation-aware frontend requests.
* Cancellation-aware backend operations.
* Reduced unnecessary network and database work.

## UX Improvements

* Responsive layouts.
* Dedicated loading states.
* Empty states.
* Error feedback.
* Disabled states during save operations.
* Consistent modal-based create/edit workflows.
* Role-aware sidebar navigation.
* Integrated leaderboard and profile pages.

## Quiz Builder Improvements

* Manual question selection.
* Topic-based filtering.
* Random question selection.
* Random selection after topic filtering.
* Prevention of duplicate questions.
* Selection persistence across pagination.

---

# Future Improvements

Possible future enhancements include:

* Advanced student performance analytics.
* Topic-level performance dashboards.
* More detailed teacher analytics.
* More powerful search and filtering.
* Bulk question management.
* Quiz cloning.
* Question import/export.
* More detailed audit logging.
* Expanded adaptive-question algorithms.
* Offline answer persistence and recovery for interrupted quiz sessions.

---

# Getting Started

## Backend

1. Open the ASP.NET Core Web API solution.
2. Configure the SQL Server connection string.
3. Configure authentication settings.
4. Configure Google authentication credentials if Google Sign-In is enabled.
5. Apply the required EF Core migrations.
6. Run the API.

The frontend expects the API to be available through the configured Axios base URL.

---

## Frontend

1. Open the Vue application.
2. Install dependencies:

```bash
npm install
```

3. Configure the backend API URL in the Axios configuration.
4. Start the development server:

```bash
npm run dev
```

The application will then communicate with the ASP.NET Core API.

---

# Summary

Quiz Platform is more than a basic CRUD project.

It combines:

```text
Authentication
        +
Role-Based Authorization
        +
Teacher Quiz Management
        +
Question Bank
        +
Topic Filtering
        +
Random Question Selection
        +
Duplicate Prevention
        +
Timed Attempts
        +
Scoring
        +
Statistics
        +
Leaderboards
        +
Profile Management
        +
UTC Scheduling
        +
Pagination
        +
Cancellation / Resource Management
        +
Responsive UI
```
