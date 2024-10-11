function openNav() {
  document.getElementById("Sidenav").style.width = "250px";
};
function closeNav() {
  document.getElementById("Sidenav").style.width = "0";
};
function openNavInfo() {
  document.getElementById("SidenavInfo").style.width = "250px";
};
function closeNavInfo() {
  document.getElementById("SidenavInfo").style.width = "0";
};
function openNavSessions() {
  document.getElementById("SidenavSessions").style.width = "250px";
};
function closeNavSessions() {
  document.getElementById("SidenavSessions").style.width = "0";
};

// Update the slider value
function updateSliderValue() {
  const slider = document.getElementById("max_context");
  const output = document.getElementById("slider-value");
  output.textContent = `Max Context: ${slider.value}`;
}

