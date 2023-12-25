
const loadingContainer = document.getElementById('loading');
const errorContainer = document.getElementById('error');
const restaurantDetailsContainer = document.getElementById('restaurantDetails');

const apiUrl = 'https://zomato-express.prerananawar.repl.co/restaurants/';

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;

  const queryParams = new URLSearchParams(new URL(url).search);
  return queryParams.get(name) || null;
};


const getRestaurantDetails = async () => {
  try {
    loadingContainer.style.display = 'block';
    errorContainer.style.display = 'none';

    const restaurantName = getParameterByName('id');
    const response = await fetch(apiUrl + restaurantName);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const restaurantData = await response.json();
    displayRestaurantDetails(restaurantData);
  } catch (error) {
    displayError(error);
  }
};

const displayRestaurantDetails = (restaurant) => {
  loadingContainer.style.display = 'none';
  errorContainer.style.display = 'none';

  restaurantDetailsContainer.innerHTML = `
    <h2>${restaurant.name}</h2>
    <p>Cuisine: ${restaurant.cuisine}</p>
    <p>Address: ${restaurant.address}, ${restaurant.city}</p>
    <p>Rating: ${restaurant.rating}</p>

    <h3>Menu:</h3>
    <ul>
      ${restaurant.menu.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
    </ul>

    <h3>Reviews:</h3>
    <ul>
      ${restaurant.reviews.map(review => `<li>${review.text} - Rating: ${review.rating}</li>`).join('')}
    </ul>
  `;
};

const displayError = (error) => {
  loadingContainer.style.display = 'none';
  errorContainer.style.display = 'block';
  errorContainer.textContent = `Error: ${error.message}`;
};

getRestaurantDetails(); 
