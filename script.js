const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal')
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name')
const websiteUrlEl = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmarks-container')

let bookmarks  =  [];

// show Modal, Focus on Input
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// modal Event listeners
modalShow.addEventListener('click',showModal)
modalClose.addEventListener('click',() => modal.classList.remove('show-modal'));
window.addEventListener('click',(e) => (e.target === modal ? modal.classList.remove('show-modal'): false));

function validate(nameValue, urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue){
        alert('please submit values for both fields')
        return false;
    }

    if (!urlValue.match(regex)){
        alert('please provide a valid web address')
        return false
    }
    // valid
    return true

}

//  Build Bookmarks DOM
function buildBookmarks() {
    // remove all bookmark elements
    bookmarkContainer.textContent = ''
    // Build items
    bookmarks.forEach((bookmark) => {
        const {name,url} = bookmark;
        // console.log(name,url)
        const item = document.createElement('div');
        item.classList.add('item');
        // closeIcon
        const closeIcon = document.createElement('i')
        closeIcon.classList.add('fas','fa-times')
        closeIcon.setAttribute('title','Delete Bookmark')
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`);
        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // favicon
        const  favicon = document.createElement('img');
        favicon.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt','Favicon')
        // Link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target','_blank');
        link.textContent = name;
        // append to bookmarks container
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo)
        bookmarkContainer.appendChild(item);

    })
}


// Fetch Bookmarks
function fetchBookmarks(){
    // Get bookmarks from localstorage
    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        bookmarks = [
            {
                name: 'Jacinto Design',
                url: 'https://jacinto.design',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    // console.log(bookmarks)
    buildBookmarks();
}

// Delete Bookmark
 function deleteBookmark(url){
    // console.log('delete URL',url)
    bookmarks.forEach((bookmark,i) => { 
        if (bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    })
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();


 }

// Handle Data from form
function storeBookmark(e) {
    e.preventDefault();
    // console.log(e)
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value
    if (!urlValue.includes('http://', 'https://')){
        urlValue = `https://${urlValue}`;
    }
    // console.log(nameValue, urlValue)
    if(!validate(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark)
    console.log(JSON.stringify(bookmarks));
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks))
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus()

}


// Event Listener
bookmarkForm.addEventListener('submit',storeBookmark);
fetchBookmarks();