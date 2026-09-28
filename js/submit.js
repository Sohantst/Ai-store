document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  const form = document.getElementById('submit-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const sub = {
      name: document.getElementById('name').value.trim(),
      creator: document.getElementById('creator').value.trim(),
      category: document.getElementById('category').value,
      desc: document.getElementById('desc').value.trim(),
      pricingType: document.getElementById('pricingType').value,
      price: document.getElementById('price').value,
      access: document.getElementById('access').value.trim(),
    };

    Store.addSubmission(sub);

    form.style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  });
});
