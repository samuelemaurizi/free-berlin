document.addEventListener(
  'DOMContentLoaded',
  () => {
    $('#selec-menu').each(function() {
      $(this)
        .children('option:first')
        .attr('hidden', 'hidden');
    });
    console.log('IronGenerator JS imported successfully!');
  },
  false
);

function openNav() {
  document.getElementById('mobile__nav').style.width = '100%';
}

function closeNav() {
  document.getElementById('mobile__nav').style.width = '0';
}
