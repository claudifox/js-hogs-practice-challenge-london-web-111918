const hogContainer = document.querySelector('#hog-container')
const hogForm = document.querySelector('#hog-form')
const nameInput = document.querySelector('#nameInput')
const specialtyInput = document.querySelector('#specialtyInput')
const medalInput = document.querySelector('#medalInput')
const weightInput = document.querySelector('#weightInput')
const greasedInput = document.querySelector('#greasedInput')
const imageInput = document.querySelector('#imageInput')
const baseUrl = 'http://localhost:3000/hogs'

const state = {
  hogs: []
}

const renderHog = hog => {
  const hogContainer = document.querySelector('#hog-container')
  const hogCard = document.createElement('div')
  hogCard.className = 'hog-card'
  hogCard.dataset.id = hog.id

  const weight = hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']
  const medal = hog['highest medal achieved']

  hogCard.innerHTML = `
  <h3 class='title'>${hog.name}</h3>
  <h5 class='specialty'>Speciality: ${hog.specialty}</h5>
  <img src='${hog.image}'/>
  <h5 class='medal'>Highest Medal Achieved: ${medal}</h5>
  <h5 class='weight'>Weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water: ${weight}</h5>
  <p> Greased: <input data-id='${hog.id}' class='greased' ${hog.greased ? 'checked': ''} type='checkbox' value='greased' ></p>
  <button class='delete-button' data-id='${hog.id}'>Delete this Hog!</button>
  `
  hogContainer.append(hogCard)
  const greasedCheckBox = hogCard.querySelector('.greased')
  greasedCheckBox.addEventListener('click', () => changeHogGreased(hog))

  const deleteButton = hogCard.querySelector('.delete-button')
  deleteButton.addEventListener('click', () => deleteHog(hog))
}

hogForm.addEventListener('submit', event => {
  event.preventDefault()

  const hog = {
    name: nameInput.value,
    specialty: specialtyInput.value,
    greased: greasedInput.checked,
    ['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']: weightInput.value,
    ['highest medal achieved']: medalInput.value,
    image: imageInput.value,
  }

  hogForm.reset()

  createHog(hog)
    .then(hog => {
      state.hogs.push(hog)
      renderHog(hog)
    })
})

const changeHogGreased = hog => {
  if(hog.greased === false) {
    hog.greased = true
  } else if (hog.greased === true) {
    hog.greased = false
  }
  greasedHog(hog)
    .then(hog => {
      state.hogs.push(hog)
      renderHog(hog)
    })
}

const renderHogs = hogs => {
  hogContainer.innerHTML = ''
  hogs.forEach(hog => renderHog(hog))
}

const initalize = () => {
  getHogs()
    .then(hogs => {
      state.hogs = hogs
      renderHogs(state.hogs)
    })
}

const getHogs = () => {
  return fetch(baseUrl)
    .then(response => response.json())
}

const createHog = hog => {
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hog)
  }).then(response => response.json())
}

const deleteHog = hog => {
  return fetch(baseUrl + `/${hog.id}`, {
    method: 'DELETE'
  }).then(() => getHogs().then(renderHogs))
}

const greasedHog = hog => {
  return fetch(baseUrl + `/${hog.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hog)
  }).then(response => response.json())
}

initalize()
