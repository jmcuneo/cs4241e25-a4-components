<script>
  export let navigateTo;
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import OTP from './OTP.svelte';
  import swal from 'sweetalert';

  let email = '';
  let currentEmail = '';
  let showModal = false;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleLogin(e) {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      swal('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    try {
      const res = await fetch('/sendOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        currentEmail = email;
        showModal = true; // Use Svelte reactivity
      } else {
        swal('Error', data.message || 'Failed to send OTP. Please try again.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to send OTP. Please try again.', 'error');
    }
  }

  function closeModal() {
    showModal = false;
  }
</script>

<Header 
  greeting="Please log in to continue" 
  showLogin={false} 
  showRegister={true} 
  showSettings={false} 
  {navigateTo} 
/>

<!-- Login Card -->
<article class="card">
  <header>
    <h2>Log In</h2>
  </header>
  <footer>
    <fieldset class="flex">
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
    <button on:click={handleLogin} class="stack icon-paper-plane">Log In</button>
  </footer>
</article>

<OTP
  bind:showModal
  {currentEmail}
  {navigateTo}
  on:close={closeModal}
/>

<Footer 
  navigateTo={navigateTo} 
  onHome={false}
  onTasks={false}
/>