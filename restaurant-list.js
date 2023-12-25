
const loadingContainer = document.getElementById('loading');
const errorContainer = document.getElementById('error');
const restaurantList = document.getElementById('restaurantList');
const cuisineFilter = document.getElementById('cuisineFilter');
const sortOptions = document.getElementById('sortOptions');
let data = [];

const apiUrl = 'https://zomato-express.prerananawar.repl.co/restaurants';

const displayLoading = () => {
  loadingContainer.style.display = 'block';
  errorContainer.style.display = 'none';
  restaurantList.innerHTML = '';
};

const displayError = (error) => {
  loadingContainer.style.display = 'none';
  errorContainer.style.display = 'block';
  errorContainer.textContent = `Error: ${error.message}`;
};

const displayRestaurants = (restaurants) => {
  loadingContainer.style.display = 'none';
  errorContainer.style.display = 'none';

  restaurantList.innerHTML = '';

  restaurants.forEach(restaurant => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `
      <h4>${restaurant.name}</h4>
      <p>Cuisine: ${restaurant.cuisine}</p>
      <p>Address: ${restaurant.address}, ${restaurant.city}</p>
      <p>Rating: ${restaurant.rating}</p>
      <button class="btn btn-primary" onclick="viewDetails('${restaurant._id}')">View Details</button>
      <button class="btn btn-danger ml-2" onclick="deleteRestaurant('${restaurant._id}')">Delete</button>
      <button class="btn btn-warning ml-2" onclick="updateRestaurant('${restaurant._id}')">Update</button>
    `;
    restaurantList.appendChild(listItem);
  });
};

const fetchData = async () => {
  try {
    displayLoading();
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    data = await response.json();
    displayRestaurants(data);
  } catch (error) {
    displayError(error);
  }
};

const applyFilter = () => {
  const selectedCuisine = cuisineFilter.value;
  const filteredRestaurants = data.filter(restaurant => selectedCuisine === '' || restaurant.cuisine === selectedCuisine);
  displayRestaurants(filteredRestaurants);
};

const applySort = () => {
  const sortBy = sortOptions.value;
  const sortedRestaurants = [...data].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b[sortBy] - a[sortBy];
    }
  });
  displayRestaurants(sortedRestaurants);
};

const viewDetails = (restaurantId) => {
  window.location.href = `restaurant-details.html?id=${restaurantId}`;
};

const deleteRestaurant = async (restaurantId) => {
  try {
    const deleteUrl = `${apiUrl}/${restaurantId}`;
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete restaurant: ${response.status}`);
    }

    fetchData();
  } catch (error) {
    displayError(error);
  }
};

const updateRestaurant = (restaurantId) => {
  window.location.href = `addrestaurant.html?updateId=${restaurantId}`;
};

fetchData();
