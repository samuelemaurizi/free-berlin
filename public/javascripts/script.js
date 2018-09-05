document.addEventListener('DOMContentLoaded', () => {
  $('#selec-menu').each(function () {
    $(this).children('option:first').attr('hidden','hidden');
  });  
  console.log('IronGenerator JS imported successfully!');

}, false);
