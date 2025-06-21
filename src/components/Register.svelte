<script>
  export let navigateTo;
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import OTP from './OTP.svelte';
  import swal from 'sweetalert';

  let displayName = '';
  let email = '';
  let currentEmail = '';
  let showModal = false;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleRegister(e) {
    e.preventDefault();
    
    const trimmedDisplayName = displayName.trim();
    const trimmedEmail = email.trim();
    
    if (!trimmedDisplayName || trimmedDisplayName.length < 3) {
      swal('Invalid Display Name', 'Please enter a valid display name with at least 3 characters.', 'error');
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      swal('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    try {
      const res = await fetch('/registerUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: trimmedDisplayName, email: trimmedEmail })
      });
      
      const contentType = res.headers.get('Content-Type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.status === 'success') {
          currentEmail = trimmedEmail;
          showModal = true;
        } else {
          swal('Error', data.message || 'Failed to register. Please try again.', 'error');
        }
      } else {
        const text = await res.text();
        swal('Error', text || 'Failed to register. Please try again.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to register. Please try again.', 'error');
    }
  }

  function closeModal() {
    showModal = false;
  }
</script>

<!-- Pull the Header component -->
<Header 
  greeting="Welcome to Magnolia." 
  showLogin={true} 
  showRegister={false} 
  showSettings={true}
  authRequired={false}
  {navigateTo} 
/>

<!-- Register Card -->
<article class="card">
  <header>
    <h2>Register</h2>
  </header>
  <footer>
    <!-- Take a display name and an email -->
    <form on:submit={handleRegister}>
      <fieldset class="flex">
        <label>
          <input 
            type="text" 
            placeholder="Display Name" 
            bind:value={displayName}
            required 
            minlength="3"
          >
        </label>
        <label>
          <input 
            type="email" 
            placeholder="Email" 
            bind:value={email}
            required 
            minlength="3"
          >
        </label>
      </fieldset>
      <button type="submit" class="stack icon-paper-plane">Register</button>
    </form>
  </footer>
</article>

<!-- OTP Component, for registration -->
<OTP
  bind:showModal
  {currentEmail}
  {navigateTo}
  on:close={closeModal}
/>

<!-- Footer Component -->
<Footer 
  navigateTo={navigateTo} 
  onHome={false}
  onTasks={false}
/>