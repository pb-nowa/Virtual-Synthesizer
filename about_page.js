const aboutPage = document.getElementById("about-page");

aboutPage.addEventListener('click', e => {
    aboutPage.className = "about-page fade-out";
    aboutPage.childNodes.forEach(node => {
        node.className += " fade-out";
    });
    document.getElementById('header-container').className += " fadeIn";
});

export default aboutPage;
