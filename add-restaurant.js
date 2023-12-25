
const loadingContainer = document.getElementById('loading');
const errorContainer = document.getElementById('error');
const successContainer = document.getElementById('success');
const restaurantForm = document.getElementById('add-restaurant-form');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');

const apiUrl = 'https://zomato-express.prerananawar.repl.co/restaurants';

const displayLoading = () => {
  loadingContainer.style.display = 'block';
  errorContainer.style.display = 'none';
  successContainer.style.display = 'none';
};

const displayError = (error) => {
  loadingContainer.style.display = 'none';
  errorContainer.style.display = 'block';
  errorContainer.textContent = `Error: ${error.message}`;
};

const displaySuccess = (isUpdate) => {
  loadingContainer.style.display = 'none';
  errorContainer.style.display = 'none';
  successContainer.style.display = 'block';

  if (isUpdate) {
    successContainer.textContent = 'Restaurant updated successfully!';
  } else {
    successContainer.textContent = 'Restaurant added successfully!';
  }
};

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;

  const queryParams = new URLSearchParams(new URL(url).search);
  return queryParams.get(name) || null;
};

const updateId = getParameterByName('updateId');
if (updateId) {
  formTitle.textContent = 'Update Restaurant';
  submitButton.textContent = 'Update Restaurant';

  console.log({ updateId })

  // Fetch existing restaurant data for pre-filling the form
  console.log({ hello: `${apiUrl}/${updateId}` })
  fetch(`${apiUrl}/${updateId}`)
    .then(response => response.json())
    .then(existingRestaurant => {
      console.log({ existingRestaurant })
      document.getElementById('name').value = existingRestaurant.name;
      document.getElementById('cuisine').value = existingRestaurant.cuisine;
      document.getElementById('address').value = existingRestaurant.address;
      document.getElementById('city').value = existingRestaurant.city;
      document.getElementById('rating').value = existingRestaurant.rating;
    })
    .catch(error => {
      displayError(error);
    });
}

restaurantForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const cuisine = document.getElementById('cuisine').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const rating = parseFloat(document.getElementById('rating').value);

  const newRestaurant = { name, cuisine, address, city, rating };

  try {
    displayLoading();
    const url = updateId ? `${apiUrl}/${updateId}` : apiUrl;

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(newRestaurant),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to ${updateId ? 'update' : 'add'} restaurant: ${response.status}`);
    }

    displaySuccess(updateId !== undefined);
  } catch (error) {
    displayError(error);
  }
});
