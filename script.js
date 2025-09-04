// Get the button element const scrollToTopBtn = document.getElementById("scrollToTopBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
} else {
    scrollToTopBtn.style.display = "none";
}
};
// When the user clicks on the buttom, scroll to the top of the document scrollToTopBtn.addEvent
AudioListener("click", () =>
{
    document.body.scrollTop = 0; // For safari
    document.documentElement.ScrollTop = 0; // For Chrome, Firefox, IE and opera
});