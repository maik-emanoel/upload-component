const fileInput = document.querySelector('#file-input')
const container = document.querySelector('.container')

const description = document.createElement('p')

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    let fileName = file.name
    let fileSize = parseFloat((file.size / (1024 * 1024))).toFixed(2)

    let fileNameFormatted = formateFileName(fileName)

    const newBox = document.createElement('div')
    newBox.classList.add('box')

    newBox.innerHTML = `
    <img src="./assets/iconBlue.svg" alt="" class="icon">

    <div class="info">
        <div class="top">
            <h2 class="name">${fileNameFormatted}</h2>
            <img   
                src="./assets/cancel-icon.svg"
                alt="Ícone de excluir o arquivo correspondente"
                class="removeBoxBtn"
                title="Remover arquivo"
            >
        </div>

        <p>
            <span class="loaded"></span>
            <span class="total">${fileSize}MB</span>
        </p>

        <div class="bottom">
            <div class="progress-bar">
                <div class="bar"></div>
            </div>

                <span class="porcentage">48%</span>
            </div>
        </div>
    `

    showProgress(newBox, file.size)
    removeDescription()
})

function showProgress(newBox, fileSize) {
    const loadedSpan = newBox.querySelector('.loaded')
    const progressBar = newBox.querySelector('.bar')
    const porcentageSpan = newBox.querySelector('.porcentage')
    const icon = newBox.querySelector('.icon')

    let loaded = 0
    let porcentage = 0
    let total = fileSize
    
    const intervalTime = 100 // tempo entre cada execução do setInterval em milissegundos
    const totalTime = 4000 // tempo total que você deseja que o arquivo demore para carregar em milissegundos
  
    const loadedIncrement = total * intervalTime / totalTime
    const porcentageIncrement = 100 * intervalTime / totalTime
  
    const updateValues = setInterval(() => {
        loaded += loadedIncrement
        porcentage += porcentageIncrement
    
        if (loaded >= total && porcentage >= 100) {
          porcentage = 100
          loaded = total
          icon.src = './assets/iconGreen.svg'
          progressBar.classList.add('upload-completed')
          porcentageSpan.classList.add('upload-completed')

          clearInterval(updateValues)
        }
    
        loadedSpan.textContent = `${(loaded / (1024 * 1024)).toFixed(2)}MB / `
        progressBar.style.width = `${porcentage}%`
        porcentageSpan.textContent = `${Math.round(porcentage)}%`
    
      }, intervalTime)

    container.appendChild(newBox)
}

container.addEventListener('click', removeBox)
function removeBox(event) {
    if(event.target.classList.contains('removeBoxBtn')) {
        const box = event.target.closest('.box')
        box.classList.add('box-leave')
        setTimeout(() => {
          container.removeChild(box);
          addDescriptionIfContainerIsEmpty()
        }, 500)
    }
}

function addDescriptionIfContainerIsEmpty() {
    if(container.children.length === 0) {
        description.classList.add('description')
        description.innerHTML = `
        Nenhum arquivo foi importado no momento. Por favor, selecione um arquivo.
        `
        container.appendChild(description)
    }
}

function removeDescription() {
    if(container.contains(description)) {
        container.removeChild(description)
    }
}

const limit = 34

function formateFileName(fileName) {
    const aboveLimit = fileName.length > limit
    const dotsOrEmpty = aboveLimit ? '...' : ''

    const fileNameFormatted = fileName.substring(0, limit) + dotsOrEmpty

    return fileNameFormatted
}