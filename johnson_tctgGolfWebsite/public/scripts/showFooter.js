var Footer = React.createClass({
  render: function () {
    return (
      <footer>
        <div id="footer-left">
          <div>
            <img src="../images/instagram-white-icon_vc.png"
              alt="Instagram Icon" />
          </div>
          <div>
            <img src="../images/facebook-logo-png-white-facebo_ql.png"
              alt="Facebook Icon" />
          </div>
        </div>
        <div class="footer-logo">
          <a title="Employee Login" href="backend/index.html">
            <img src="../images/BRLogoColor_k.png" alt="Logo" />
          </a>
        </div>
        <div class="footer-right">
          <p><span class="footer-contact-title">Contact</span><br /><br />
            Burning Ridge Golf Club<br />
            <a href="https://www.google.com/maps/search/?api=1&query=500+Burning+Ridge+Rd.,+Conway,+SC+29526" target="_blank">
              500 Burning Ridge Rd.<br />
              Conway, SC 29526<br />
            </a>
            <a href="tel:8433470538">(843) 347-0538</a><br /></p>
        </div>
      </footer>
    );
  }
});

ReactDOM.render(
  <Footer />,
  document.getElementById('footer')
);