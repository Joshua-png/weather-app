// const url = 'http://localhost:4000/weather?address=boston' 
const formSelector = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

messageOne.textContent = '';
messageTwo.textContent = '';

formSelector.addEventListener('submit', (event) => {
  event.preventDefault()

  const address = search.value;
  const url = `/weather?address=${address}`;

  messageOne.textContent = 'Loading...';
  messageTwo.textContent = '';
  
  fetch(url)
  .then(response => response.json())
  .then(data => {
    if(data.error){
      // return console.log(data.error)
      return messageOne.textContent = data.error;
    }
    messageOne.textContent = data.forecast;
    messageTwo.textContent = `Address : ${data.address} Location: ${data.location}`
    // console.log(data.forecast)
    // console.log(data.address)
    // console.log(data.location)
  });

})