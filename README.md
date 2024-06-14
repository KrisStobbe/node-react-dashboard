# Provider Fit Analysis Server & Web Application

## Project Description
This Node.js server and web application dynamically lists all upcoming jobs that require provider assignment, enabling users to explore and evaluate potential providers ranked from best to worst fit based on various configurable factors. The backend processes data from CSV files to populate job and provider information, and ranks providers according to factors such as proximity, cost efficiency, turnaround time, and ratings. 

These factors are normalized and can be dynamically adjusted by users through an interactive frontend interface, allowing for real-time customization of how providers are evaluated and presented.

## Running the Local Dev Environment

### Prerequisites
- Node.js (LTS version)
- npm

### Backend Setup
1. **Clone the repository**:

```bash
git clone https://github.com/KrisStobbe/node-react-dashboard.git
```

2. **Navigate to the backend directory** (from the root of the project):

```bash
cd backend
```

3. **Install dependencies**:

```bash
npm install
```

4. **Start the server**:

```bash
npm run dev
```

This will start the Node.js/Express server on `http://localhost:80`.

### Frontend Setup
1. **Navigate to the frontend directory** (from the root of the project):

```bash
cd frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Start the frontend application**:

```bash
npm start
```

This command will serve the React application on `http://localhost:5173/`.

## Architecture & Approach

### Backend
The backend is built with Node.js and Express. It includes:
- **CSV Data Ingestion**: Server starts by loading jobs and providers from CSV files into memory.
- **API Endpoints**:
  - `GET /api/jobs`: Retrieves all upcoming jobs.
  - `GET /api/jobs/:jobId/providers`: Retrieves providers sorted by best fit based on job requirements.

### Frontend
The frontend is developed using React and makes use of Material-UI for styling components:
- **Job List Display**: Shows all upcoming jobs.
- **Provider Fit Analysis**: When a job is selected, it displays a sorted list of providers based on fit.

### Data Processing
- **Sorting Algorithms**: Providers are ranked based on proximity, cost-efficiency, turnaround time, and ratings.
- **Normalization**: Provider metrics are normalized to ensure fair comparison.

## With More Time
Given more time to enhance the project, the following improvements would be considered:
- **Database Migration for CSV Data**: Transition from loading CSV data directly into memory to storing it in a dedicated PostgreSQL database. This change would not only enhance data accessibility and management but also improve the efficiency and scalability of data operations, facilitating more complex queries and data analysis.
- **Statistical Normalization**: Refine the application of a normal distribution to metrics, focusing on transformations that mitigate skewness. This enhancement would standardize the weighting of factors like proximity, cost-efficiency, and turnaround times, ensuring a fairer and more robust provider comparison by normalizing data distributions and reducing outlier impacts.
- **Intuitive Preference Configuration**: Improve the layering and configuration of user preferences in the UI to make it more intuitive. This could include implementing sliders with dynamic visual feedback or interactive graphs that users can manipulate to see how changes in preferences would affect provider rankings in real time.
- **Interactive Provider Metrics Display**: Enhance the UI to show detailed metrics about a provider when clicked on or hovered over. This could include displaying a popup or sidebar with information like historical performance, average cost, rating distributions, and response times. Such interactive elements would aid users in making more informed decisions when selecting a provider for a job.
