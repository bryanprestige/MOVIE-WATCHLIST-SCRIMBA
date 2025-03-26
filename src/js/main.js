import { simpleFetch } from './lib/simpleFetch.js'


document.addEventListener('DOMContentLoaded', () => {

    
    generateScheme()

    const generateButton = document.querySelector('#generate')
    generateButton.addEventListener('click', () => {
        generateScheme()
    })

    const paragraph = document.querySelectorAll('.button-copy')
    paragraph.forEach(paragraph => paragraph.addEventListener('click', copyClipboard ))

    const modeButton = document.querySelector('#mode')
    modeButton.addEventListener('click', () => {
        const body = document.querySelector('body')
        paragraph.forEach(paragraph => paragraph.classList.toggle('dark-mode'))
        body.classList.toggle('dark-mode')  
        
        modeButton.innerHTML = body.classList.contains('dark-mode') ? '🌞' : '🌙'
    })
})

function getSelectValue() {
    const select = document.querySelector('select')
    return select.value
}

function getColorValue () {
    const colorInput = document.querySelector('#color-input').value
   return colorInput
}

function generateScheme () {
    let colorValue= getColorValue().replace('#', '')
    let selectValue = getSelectValue()
    getScheme(colorValue,selectValue)

}

async function getScheme (colorValue,selectValue) {
    const apiData = await getAPIData(` https://www.thecolorapi.com/scheme?hex=${colorValue}&mode=${selectValue}&count=5`);    
    
    giveTextColors(apiData)
    giveColors(apiData)
}


function giveTextColors (apiData) {
    const firstColor = apiData.colors[0].hex.value
    const secondColor = apiData.colors[1].hex.value
    const thirdColor = apiData.colors[2].hex.value
    const fourthColor = apiData.colors[3].hex.value
    const fifthColor = apiData.colors[4].hex.value
    const firstColorText = document.querySelector('#first-color')
    const secondColorText = document.querySelector('#second-color')
    const thirdColorText = document.querySelector('#third-color')
    const fourthColorText = document.querySelector('#fourth-color')
    const fifthColorText = document.querySelector('#fifth-color')
    firstColorText.textContent = firstColor
    secondColorText.textContent = secondColor
    thirdColorText.textContent = thirdColor
    fourthColorText.textContent = fourthColor
    fifthColorText.textContent = fifthColor
}

function giveColors (apiData) {
    const firstColor = apiData.colors[0].hex.value
    const secondColor = apiData.colors[1].hex.value
    const thirdColor = apiData.colors[2].hex.value
    const fourthColor = apiData.colors[3].hex.value
    const fifthColor = apiData.colors[4].hex.value
    const firstColorBox = document.querySelector('.color-1')
    const secondColorBox = document.querySelector('.color-2')
    const thirdColorBox = document.querySelector('.color-3')
    const fourthColorBox = document.querySelector('.color-4')
    const fifthColorBox = document.querySelector('.color-5')
    firstColorBox.style.backgroundColor = firstColor
    secondColorBox.style.backgroundColor = secondColor
    thirdColorBox.style.backgroundColor = thirdColor
    fourthColorBox.style.backgroundColor = fourthColor
    fifthColorBox.style.backgroundColor = fifthColor
}

function copyClipboard () {
    navigator.clipboard.writeText(this.textContent)
    alert('Copiado al portapapeles')
}

async function getAPIData(apiURL, method = 'GET' , data) {
    let apiData
  
    try {
        let headers = new Headers()

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }

        apiData = await simpleFetch(apiURL, {
          // Si la petición tarda demasiado, la abortamos
          signal: AbortSignal.timeout(3000),
          method: method,
          body: data ?? undefined,
          headers: headers
        });
      } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
        //console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          //console.error('Not found');
        }
        if (err.response.status === 500) {
          //console.error('Internal server error');
        }
      }
    }
    return apiData
  }