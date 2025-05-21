# Housing Web application

<h1>
  Overview
</h1><br>

<p>
  HSPA is a comprehensive web application for buying, selling, and renting real estate properties. The platform connects property buyers, sellers, and renters through an intuitive interface with powerful search capabilities, detailed property listings, and an integrated messaging system.
</p><br>
<img width="1323" alt="Screenshot 2025-05-21 at 6 11 12 PM" src="https://github.com/user-attachments/assets/73993fe8-5889-4987-808a-395eacbf612d" />

<h1>Features</h1>

<h2>For Property Seekers</h2>

<ul>
  <li>
    <h3>Advanced Property Search :</h3><p> Filter properties by city, built area, and more</p>  
  </li>
  <li>
    <h3>Detailed Property Listings:</h3><p> View comprehensive information including high-quality photos, price, area, furnishing status, and location</p>  
  </li>
  <li>
    <h3>Interactive Map Integration:</h3><p> Search properties by location using Google Maps integration</p>  
  </li>
  <li>
    <h3>Direct Messaging :</h3><p> Connect directly with property owners through the in-app messaging system</p>  
  </li>
</ul>

<h2>For Property Owners</h2>

<ul>
  <li>
    <h3>Free Property Listing:</h3><p> List your property with detailed specifications</p>
  </li>
  <li>
    <h3>Property Management:</h3><p> Update details, upload multiple photos, and track interest</p>
  </li>
  <li>
    <h3>User Dashboard:</h3><p> Manage all your properties in one place</p>
  </li>
  <li>
    <h3>Real-time Communication:</h3><p>Chat with potential buyers or renters directly</p>
  </li>
</ul>

<h2>Platform Features</h2>

<ul>
  <li>
    <h3>User Authentication:</h3><p>Secure registration and login system</p>
  </li>
  <li>
    <h3>Multi-role Support:</h3><p>Different access levels for admins, owners, and readers</p>
  </li>
  <li>
    <h3>Responsive Design:</h3><p>Seamless experience across desktop and mobile devices</p>
  </li>
  <li>
    <h3>Real-time Messaging</h3><p>Instant communication between users</p>
  </li>
</ul>


<h2>Technology Stack</h2>

<ul>
  <li>
    <h3>Frontend:</h3><p>Angular with TypeScript</p>  
  </li>
  <li>
    <h3>Backend:</h3><p>ASP.NET Core Web API</p>
  </li>
  <li>
    <h3>Database:</h3><p>Microsoft SQL Server</p>
  </li>
  <li>
    <h3>Authentication:</h3><p>JWT with role-based authorization</p>
  </li>
  <li>
    <h3>Styling:</h3><p>Bootstrap, Angular Material, CSS</p>
  </li>
  <li>
    <h3>Maps Integration:</h3><p>Google Maps API</p>
  </li>
  <li>
    <h3>Real-Time Communication:</h3><p>Google Firebase</p>
  </li>
</ul>

<h1>Application Screenshots</h1>

<h2>Property Listings</h2>

<img width="1800" alt="Screenshot 2025-05-21 at 6 03 22 PM" src="https://github.com/user-attachments/assets/eaee48c6-06cb-436e-b0a2-5eb6ea43311a" />

<p>Browse through various property listings with filter options</p>

<h2>Property Details</h2>

<img width="1324" alt="Screenshot 2025-05-21 at 6 09 35 PM" src="https://github.com/user-attachments/assets/b0ead293-fdf4-4be3-9e2d-52f1fde6be70" />
<img width="1325" alt="Screenshot 2025-05-21 at 6 08 47 PM" src="https://github.com/user-attachments/assets/582a76fe-9e31-4ca5-b551-8c13ce66493a" />

<p>Detailed view of property with specifications and photos</p>

<h2>User Registration</h2>

<img width="1800" alt="Screenshot 2025-05-21 at 6 04 08 PM" src="https://github.com/user-attachments/assets/1b7e41d2-97b8-4a8b-b68d-12e14db4e773" />

<p>Simple and secure user registration process</p>

<h2>Chat Interface</h2>

<img width="1322" alt="Screenshot 2025-05-21 at 6 07 22 PM" src="https://github.com/user-attachments/assets/e36a34e6-4676-42d2-91b0-4a035131bd0f" />

<p>Real-time messaging between property seekers and owners</p>

<h2>Property Listing Form</h2>

<img width="1786" alt="Screenshot 2025-05-21 at 6 05 34 PM" src="https://github.com/user-attachments/assets/d0dad6d6-b172-4d95-b84e-e481f3231ec5" />

<p>Intuitive interface for adding new properties with location selection</p>

<h2>Key Technical Implementations</h2>

<ul>
  <li>
    <h3>Reactive Forms </h3><p>for robust validation and form management</p>
  </li>
  <li>
    <h3>Lazy Loading Modules </h3><p>for optimized performance</p>
  </li>
  <li>
    <h3>JWT Authentication </h3><p>with secure token management</p>
  </li>
  <li>
    <h3>Repository Pattern </h3><p>for clean data access abstraction</p>
  </li>
  <li>
    <h3>Dependency Injection </h3><p>for loose coupling and testability</p>
  </li>
  <li>
    <h3>RESTful API </h3><p>design for seamless communication</p>
  </li>
  <li>
    <h3>Real-Time Notifications </h3><p>using Google Firebase</p>
  </li>
  <li>
    <h3>Responsive UI </h3><p>with mobile-first approach</p>
  </li>
  <li>
    <h3>Role-based Authorization </h3> <p>for secure access control</p>
  </li>
</ul>

<h2>Future Enhancements</h2>

<ul>
  <li>
    <p>Integration with payment gateways for premium listings</p>
  </li>
  <li>
    <p>AI-powered property recommendations</p>
  </li>
  <li>
    <p>Virtual property tours</p>
  </li>
  <li>
    <p>Advanced analytics for property owners</p>
  </li>
  <li>
    <p>Mobile applications for iOS and Android</p>
  </li>
</ul>

<h2>Installation and Setup</h2>

<p>
  # Clone the repository
git clone https://github.com/yourusername/hspa.git

# Navigate to the project directory
cd hspa

# Install dependencies for the frontend
cd frontend
npm install

# Start the frontend application
ng serve

# Navigate to the backend directory
cd ../backend

# Restore .NET packages
dotnet restore

# Run the backend application
dotnet run
</p>









