<script>
    export let showModal = false;
    export let currentEmail = '';
    export let navigateTo = null;
    import swal from 'sweetalert';

    let otpCode = '';

  async function handleOTPSubmit(e) {
    e.preventDefault();
    
    if (!otpCode) {
      swal('Missing OTP', 'Please enter the OTP sent to your email.', 'warning');
      return;
    }

    try {
      const res = await fetch('/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode, email: currentEmail })
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        navigateTo('home');
      } else {
        swal('Error', data.message || 'Failed to verify OTP. Please try again.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to verify OTP. Please try again.', 'error');
    }
  }

  function closeModal() {
    showModal = false;
    otpCode = '';
  }

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
    closeModal();
  }
</script>

<!-- OTP Modal -->
{#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="modal-backdrop" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="otp-title"
        tabindex="-1"
    >
        <div class="modal-content" role="document">
            <button 
                type="button" 
                class="close-button" 
                on:click={handleClose}
                aria-label="Close OTP verification modal"
            >
                &times;
            </button>

            <h2 id="otp-title">Email Verification</h2>
            
            <p>We've sent a verification code to <strong>{currentEmail}</strong></p>
            
            <form on:submit={handleOTPSubmit}>
              <!-- User inputs their OTP -->
                <div class="form-group">
                    <label for="otp-input">Enter verification code:</label>
                    <input 
                        id="otp-input"
                        type="text" 
                        bind:value={otpCode} 
                        placeholder="Enter 12-digit code"
                        maxlength="12"
                        required
                        autocomplete="one-time-code"
                    />
                </div>
                
                <!-- Buttons for Modal -->
                <div class="button-group">
                    <button type="submit" class="btn-primary">Verify</button>
                    <button type="button" class="btn-secondary" on:click={handleClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- CSS -->
<style>
  .modal-content {
    background: var(--base);
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    border: #000 solid 1px;
    margin: 5% auto;
    padding-left: 2%;
    padding-right: 2%;
    padding-bottom: 1.5%;
    color: var(--option);
  }

  .modal-backdrop {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-self: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
  }

  #otp-input {
    background-color: var(--base);
    color: var(--option);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
</style>