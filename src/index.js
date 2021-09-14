let addToy = false;
const toyContainer = document.querySelector("#toy-collection")
const toyForm = document.querySelector(".add-toy-form")


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function renderToys(toys) {
  
  const toyCard = document.createElement('div');
  toyCard.id = `toy-${toys.id}`;
  toyCard.className = 'card';
  
  const toyName = document.createElement('h2');
  toyName.textContent = toys.name;
  
  const toyImg = document.createElement('img');
  toyImg.src = toys.image;
  toyImg.alt = `${toys.name} image`;
  toyImg.className = "toy-avatar"
  
  const likes = document.createElement('p');
  likes.textContent = `${toys.likes} likes`;
  
  const btn = document.createElement('button');
  btn.id = '[toy_id]';
  btn.className = 'like-btn';
  btn.textContent = "♥ LIKE ♥";
  btn.addEventListener('click', () => increaseLikes(toys));

  const deleteBTN = document.createElement('button');
  deleteBTN.className = 'like-btn';
  deleteBTN.textContent = "X DELETE X";
  deleteBTN.addEventListener('click', () => {
    toyCard.remove()
    deleteToy(toys.id)
  }); 
  
  toyCard.append(toyName, toyImg, likes, btn, deleteBTN);
  toyContainer.appendChild(toyCard);
  
}

function deleteToy(id){
  fetch (`http://localhost:3000/toys/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
})
  .then(() => document.getElementById(`toy-${id}`).remove)
} 


function increaseLikes(toys) {
  const likeElement = event.target.previousElementSibling;
  const likesIncrease = ++toys.likes;
  likeElement.textContent = `${likesIncrease} likes`;
  fetch(`http://localhost:3000/toys/${toys.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({likes: likesIncrease}),
  })

}

function createToy(e) {
  e.preventDefault();
  const newToyForm = e.target
  const toyName =  newToyForm.querySelector('#toyName').value;
  const toyImg =  newToyForm.querySelector('#toyImage').value;

  if (toyName !== "" && toyImg !== "") {
    const toy = {
      name: toyName,
      image: toyImg,
      likes: 0,
    };

    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toy),
    };

    fetch("http://localhost:3000/toys", configObj)
      .then((resp) => resp.json())
      .then(renderToys);
    newToyForm.reset(); 
  } else {
    alert("Fill in the form!!!");
  }

}

function getToys(){
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(toys => {
    toys.forEach(renderToys)
  })
  .catch(err => alert(err))
}

function init() {
  getToys();
  toyForm.addEventListener('submit', createToy);
}

init()