const LIMIT = 2;
const API_KEY = 'live_oo7G3zpcRSyjSsBNE4vf6rWjvk1Ie7bmwwPDLSJiX6Bem1jeeD6m1NPRFkhJjY6m'
const API_URL_RANDOM = (limit) => `https://api.thecatapi.com/v1/images/search?limit=${limit}`;
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error');

const loadRandomMichis = async () => {
  try {
    const res = await fetch(API_URL_RANDOM(LIMIT), {
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY
      },
    });
    const data = await res.json();

    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
      const img1 = document.getElementById('img1')
      const img2 = document.getElementById('img2')
      const btn1 = document.getElementById('btn1');
      const btn2 = document.getElementById('btn2');

      img1.src = data[0].url
      img2.src = data[1].url

      btn1.onclick = () => saveFavouriteMichi(data[0].id);
      btn2.onclick = () => saveFavouriteMichi(data[1].id);
    }

  } catch (error) {
    return error.message;
  }
}

async function loadFavoritesMichis() {
  try {
    const res = await fetch(API_URL_FAVORITES, {
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY,
      }
    });
    const data = await res.json();
    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
      const section = document.querySelector('#favoritesMichis');
      section.innerHTML = '';
      const h2 = document.createElement('h2');
      const h2Text = document.createTextNode('Michis favoritos');
      h2.appendChild(h2Text);
      section.appendChild(h2);

      data.forEach(michi => {
        const article = document.createElement('article');
        const img = document.createElement('img');
        const btn = document.createElement('button');
        const btnText = document.createTextNode('Sacar al michi de favoritos');

        img.src = michi.image.url;
        img.width = 150;
        btn.appendChild(btnText);
        btn.onclick = () => deleteFavoriteMichi(michi.id);
        article.appendChild(img);
        article.appendChild(btn);
        section.appendChild(article);

      });
    }
  } catch (error) {
    return error.message;
  }
}

async function saveFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVORITES, {
    method: 'POST',
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: id
    }),
  });

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    console.log('Michi guardado en favoritos');
    loadFavoritesMichis();
  }
}

async function deleteFavoriteMichi(id) {
  const res = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: 'DELETE',
    headers: {
      'X-API-KEY': API_KEY
    },
  });

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    console.log('Michi sacado de favoritos');
    loadFavoritesMichis();
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);

  console.log(formData.get('file'));

  const res = await fetch(API_URL_UPLOAD, {
    method: 'POST',
    headers: {
      'X-API-KEY': API_KEY,
    },
    body: formData,
  })
  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    console.error({ data });
  } else {
    console.log('Foto de michi subida :)');
    console.log({ data });
    console.log(data.url);

    document.querySelector('#file').value = '';
    document.querySelector('#michiPhoto').src = '';

    saveFavouriteMichi(data.id);
  }
}

const input = document.getElementById('file');
const img = document.getElementById('michiPhoto');
input.onchange = (e) => {
  const [file] = e.target.files;
  if (file) {
    img.src = URL.createObjectURL(file);
  }
}

loadRandomMichis();
loadFavoritesMichis();