(function(){
  const image = document.getElementById('screenImage');
  const buttons = Array.from(document.querySelectorAll('.chip'));
  const screens = {
    home: 'assets/screen_home.png',
    new_day: 'assets/screen_new_day.png',
    catch_entry: 'assets/screen_catch_entry.png',
    fishing_day: 'assets/screen_fishing_day.png',
    hints: 'assets/screen_hints.png',
    report: 'assets/screen_report.png',
    season: 'assets/screen_season.png'
  };

  function activate(name) {
    image.src = screens[name];
    buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.screen === name));
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.screen));
  });

  setTimeout(() => activate('home'), 2200);
})();