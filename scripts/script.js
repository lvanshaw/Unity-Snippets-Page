// script.js

async function saveSnippet() {
    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;
    const imageInput = document.getElementById('imageInput');

    if (!title || !content) {
        alert('Title and content are required.');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // Append each selected image to FormData
    for (let i = 0; i < imageInput.files.length; i++) {
        formData.append('images', imageInput.files[i], imageInput.files[i].name);
    }

    const response = await fetch('http://localhost:3000/snippets', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        // Clear input fields
        titleInput.value = '';
        contentInput.value = '';
        imageInput.value = '';

        // Save to localStorage
        // saveSnippetsToLocalStorage();

        loadSnippets();
    } else {
        const { error } = await response.json();
        alert(error);
    }
}

// Function to handle file input change
function handleFileInputChange() {
    const imageInput = document.getElementById('imageInput');
    const files = imageInput.files;

    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i], files[i].name);
    }
}

async function toggleCode(index) {
    const codeContent = document.getElementById('codeContent' + index);
    codeContent.style.display = (codeContent.style.display === 'none' || codeContent.style.display === '') ? 'block' : 'none';
}

async function removeSnippet(index) {
    const response = await fetch(`http://localhost:3000/snippets/${index}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        loadSnippets();
    } else {
        const { error } = await response.json();
        alert(error);
    }
}

async function searchSnippets() {
    const searchInput = document.getElementById('searchInput').value;
    const response = await fetch(`http://localhost:3000/snippets/${searchInput}`);
    const snippets = await response.json();
    const codeSnippetsContainer = document.getElementById('codeSnippets');

    // Clear existing snippets
    codeSnippetsContainer.innerHTML = '';

    // Display each snippet
    snippets.forEach(function (snippet, index) {
        const snippetContainer = document.createElement('div');
        snippetContainer.className = 'code-container';

        const snippetTitle = document.createElement('div');
        snippetTitle.className = 'code-title';
        snippetTitle.innerHTML = snippet.title;
        snippetTitle.onclick = function () {
            toggleCode(index);
        };

        const snippetActions = document.createElement('div');
        snippetActions.className = 'code-actions';

        const removeButton = document.createElement('button');
        removeButton.className = 'removeButton';
        removeButton.innerHTML = 'Remove';
        removeButton.onclick = function () {
            removeSnippet(index);
        };

        snippetActions.appendChild(removeButton);

        const snippetContent = document.createElement('div');
        snippetContent.id = 'codeContent' + index;
        snippetContent.className = 'code-content';
        snippetContent.innerHTML = snippet.content;

        // Display images if present
        if (snippet.images && snippet.images.length > 0) {
            const imageList = document.createElement('ul');
            imageList.className = 'image-list';

            snippet.images.forEach((image, imageIndex) => {
                const imageItem = document.createElement('li');
                imageItem.innerHTML = `<span class="image-name" onclick="openImageModal('${image}')">${image}</span>`;
                imageList.appendChild(imageItem);
            });

            snippetContent.appendChild(imageList);
        }

        snippetContainer.appendChild(snippetTitle);
        snippetContainer.appendChild(snippetActions);
        snippetContainer.appendChild(snippetContent);

        codeSnippetsContainer.appendChild(snippetContainer);
    });
}

async function loadSnippets() {
    const response = await fetch('http://localhost:3000/snippets');
    const snippets = await response.json();
    const codeSnippetsContainer = document.getElementById('codeSnippets');

    // Clear existing snippets
    codeSnippetsContainer.innerHTML = '';

    // Display each snippet
    snippets.forEach(function (snippet, index) {
        const snippetContainer = document.createElement('div');
        snippetContainer.className = 'code-container';

        const snippetTitle = document.createElement('div');
        snippetTitle.className = 'code-title';
        snippetTitle.innerHTML = snippet.title;
        snippetTitle.onclick = function () {
            toggleCode(index);
        };

        const snippetActions = document.createElement('div');
        snippetActions.className = 'code-actions';

        const removeButton = document.createElement('button');
        removeButton.className = 'removeButton';
        removeButton.innerHTML = 'Remove';
        removeButton.onclick = function () {
            removeSnippet(index);
        };

        snippetActions.appendChild(removeButton);

        const snippetContent = document.createElement('div');
        snippetContent.id = 'codeContent' + index;
        snippetContent.className = 'code-content';
        snippetContent.innerHTML = snippet.content;

        // Display images if present
        if (snippet.images && snippet.images.length > 0) {
            const imageList = document.createElement('ul');
            imageList.className = 'image-list';

            snippet.images.forEach((image, imageIndex) => {
                const imageItem = document.createElement('li');
                imageItem.innerHTML = `<span class="image-name" onclick="openImageModal('${image}')">${image}</span>`;
                imageList.appendChild(imageItem);
            });

            snippetContent.appendChild(imageList);
        }

        snippetContainer.appendChild(snippetTitle);
        snippetContainer.appendChild(snippetActions);
        snippetContainer.appendChild(snippetContent);

        codeSnippetsContainer.appendChild(snippetContainer);
    });
}

// Function to open the modal with the clicked image
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = `http://localhost:3000/${imageSrc}`;
    modal.style.display = 'block';
}

// Function to close the modal
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

// ... (existing code)

// Load existing snippets on page load
loadSnippets();
