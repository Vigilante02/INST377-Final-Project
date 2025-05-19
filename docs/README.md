# AirAware: AQI & Weather Dashboard

A web application providing real-time air quality index (AQI) and weather data to help outdoor workers and at-risk individuals make informed decisions.

## Supported Browsers

- Desktop Browsers: Chrome, Firefox, Edge
- Mobile Browsers: iOS Safari, Android Chrome

## Developer Manual

This guide helps future developers set up, run, and maintain this application.

### Installation

Clone this repository:

```bash
git clone https://github.com/<your-username>/airaware-dashboard
cd airaware-dashboard
```

Install dependencies:

```bash
npm install
```

Set up your environment variables by creating a `.env` file using `.env.example`:

```bash
cp .env.example .env
```

Update your `.env` file with your API keys and Supabase credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
WEATHERSTACK_KEY=your_weatherstack_api_key
AQICN_TOKEN=your_aqicn_api_token
```

### Running the Application

Start the local development server:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Project Structure

- `index.html`: Main homepage with city search form.
- `about.html`: Information about the project and supported browsers.
- `dashboard.html`: Dashboard displaying favorites, AQI trends, and a map view.
- `style.css`: CSS styling for the entire application.
- `script.js`: Handles fetching data from external APIs, updating the UI, managing favorites, and map/chart integration.
- `favorites.js`: Supabase integration to store and retrieve user favorites.
- `vercel.json`: Configuration file for Vercel deployment.

### API Endpoints

- **GET `/api/favorites`**: Retrieves saved city favorites from Supabase.
- **POST `/api/favorites`**: Saves a new favorite city into Supabase.

### Known Issues

- Potential API latency or rate limits from AQICN and Weatherstack.
- Map requires manual refresh when updating dynamically.

### Future Development Roadmap

- Implement comprehensive testing.
- Improve UI responsiveness and accessibility.
- Introduce user authentication for personalized data.
- Extend data visualization features with additional metrics.

Documentation is stored in the `docs/` directory within the main project repository.
