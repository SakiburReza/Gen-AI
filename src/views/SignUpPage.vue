<script setup>
import { ref, watch } from 'vue'
import genAiService from '@/services/gen-ai'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

// Reactive form data object
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Reactive password mismatch flag
const passwordMismatch = ref(false)

// Watcher to update `passwordMismatch`
watch(
  () => [formData.value.password, formData.value.confirmPassword],
  ([password, confirmPassword]) => {
    passwordMismatch.value = password && confirmPassword && password !== confirmPassword
  }
)

// Modal visibility
const showTermsModal = ref(false)

const submitForm = async () => {
  if (passwordMismatch.value) {
    toastStore.error('Passwords do not match. Please correct them.')
    return
  }

  toastStore.success('Passwords match! Proceeding with form submission.')

  // Create a new object excluding termsAccepted from the payload
  const { termsAccepted, ...formPayload } = formData.value

  try {
    const response = await genAiService.register(formPayload)
    if (response.data?.status && response.data?.code === 200) {
      toastStore.success(response.data.message || 'Registration successful!')
    } else {
      toastStore.error(response.data?.message || 'Failed to register.')
    }
  } catch (error) {
    toastStore.error('An unexpected error occurred. Please try again later.')
  }
}
</script>



<template>

  <div class="flex justify-center items-center min-h-screen relative"
    style="background-image: url('/images/BG.jpg'); background-size: cover; background-position: center;">

    <!-- Logo in Front of Background -->
    <div class="absolute top-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-start z-9">
      <!-- Logo -->
      <img src="/images/zeuxis.png" alt="Zeuxis logo" class="w-30 h-23" />
    </div>




    <!-- Left Side - Image and Text -->
    <div class="relative lg:w-1/4 hidden sm:flex justify-center h-full items-center">
      <!-- Background Image with Overlay -->
      <img src="/public/images/Rectangle.png" alt="Background Image" class="w-full h-full object-cover" />


      <!-- Overlay Content -->
      <div class="absolute inset-0 flex flex-col p-6">
        <h1 class="md:text-2xl lg:text-3xl font-bold leading-tight text-black">
          CREATE <span class="text-blue-400">IMAGES</span> AND THEN TURN THOSE INTO
          <span class="text-blue-400">VIDEOS</span> IN <span class="text-blue-400">SECONDS</span>.
        </h1>
      </div>

      <!-- Secondary Display Image -->
      <img src="/public/images/slides.png" alt="Secondary Display Image" class="absolute bottom-0 left-0 w-full" />
    </div>

    <!-- Right Side - Sign-Up Form -->
    <div class="lg:w-1/4 flex flex-col justify-center items-center px-6 h-full bg-white">
      <!-- Form Container -->
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold mb-3 text-center text-gray-800">Sign Up</h2>

        <!-- Sign-Up Form -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input id="fullName" v-model="formData.name" type="text" placeholder="Enter your full name"
              class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
              aria-label="Full Name" required />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" v-model="formData.email" type="email" placeholder="Enter your email"
              class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
              aria-label="Email" required />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" v-model="formData.password" type="password" placeholder="Enter your password"
              class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
              aria-label="Password" required />
          </div>

          <!-- Confirm Password -->
          <div class="mt-4">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input id="confirmPassword" v-model="formData.confirmPassword" type="password"
              placeholder="Confirm your password"
              class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
              aria-label="Confirm Password" required />
            <!-- Error message -->
            <p v-if="passwordMismatch" class="text-red-500 text-sm mt-2">
              Passwords do not match.
            </p>
          </div>

          <!-- Checkbox -->
          <div class="flex items-center">
            <input type="checkbox" id="agree" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Accept Terms" required />
            <label for="agree" class="ml-2 text-sm text-gray-600">
              I agree to the
              <button type="button" class="text-blue-600 hover:underline" @click="showTermsModal = true">
                Terms and Conditions</button>.
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
              aria-label="Sign Up" :class="{
                'w-full text-sm py-3 rounded-lg': true,
                'bg-black text-white hover:bg-gray-800': !isButtonDisabled,
                'bg-gray-300 text-gray-500 cursor-not-allowed': isButtonDisabled
              }">
              Sign Up
            </button>
          </div>
        </form>

        <!-- Login Link -->
        <p class="text-sm text-gray-600 text-center mt-4">
          I'm already a member.
          <router-link to="/" class="text-blue-600 hover:underline">Sign In</router-link>
        </p>
      </div>
    </div>

    <!-- Terms Modal -->
    <div v-if="showTermsModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg max-w-3xl w-full">
        <div class="flex justify-center items-center mt-1 top-1">
          <img src="/images/zeuxis.png" alt="Zeuxis logo" class="w-30 h-23" />
        </div>
        <div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
          <div
            class="overflow-y-auto max-h-96 p-4 bg-tertiary border border-grey rounded-md text-sm text-gray-800 leading-relaxed">
            <p class="font-semibold text-gray-900">Last Updated: 31st December 2024</p>

            <h3 class="text-2xl font-bold mb-4">Terms and Conditions</h3>

            <ol class="list-decimal ml-6 mt-2 space-y-4">
              <li>
                <strong>Acceptance of Terms</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>Binding Agreement:</strong> By using the Software, you confirm legal capacity to enter into
                    a binding contract and agree to these terms.
                  </li>
                  <li>
                    <strong>Changes to Terms:</strong> The Company may modify this Agreement anytime, with changes
                    posted on the website or via notifications. Continued use indicates acceptance.
                  </li>
                </ul>
              </li>

              <li>
                <strong>License and Use of the Software</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>License Grant:</strong> Limited, non-exclusive, non-transferable, revocable license for
                    internal, lawful purposes.
                  </li>
                  <li>
                    <strong>Restrictions:</strong> Do not create unlawful, harmful, or infringing images or videos.
                  </li>
                  <li>
                    No reverse engineering, disrupting integrity, or harming minors or third parties.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Prohibited Content</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>Illegal, harmful, harassing, hateful, defamatory, or otherwise objectionable content.</li>
                  <li>Content infringing third-party rights (e.g., copyright, trademark).</li>
                  <li>Violent or sexual content violating laws.</li>
                  <li>Content encouraging unlawful behavior.</li>
                </ul>
              </li>

              <li>
                <strong>User Accounts</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>Registration:</strong> Provide accurate, complete, and current information and keep it
                    updated.
                  </li>
                  <li>
                    <strong>Account Security:</strong> Maintain confidentiality of credentials; notify the Company of
                    unauthorized access.
                  </li>
                  <li>
                    <strong>Account Termination:</strong> The Company may suspend or terminate accounts for violations
                    or unacceptable conduct.
                  </li>
                </ul>
              </li>

              <li>
                <strong>User-Generated Content</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>Ownership:</strong> You retain ownership of content you create.
                  </li>
                  <li>
                    <strong>Responsibility:</strong> You are responsible for legality and consequences of your generated
                    content.
                  </li>
                  <li>
                    <strong>License to Company:</strong> Grant the Company a license to host, store, and modify your
                    content for operational purposes.
                  </li>
                  <li>
                    <strong>Monitoring:</strong> The Company may monitor or remove content for compliance with laws or
                    policies.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Intellectual Property</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>Company IP:</strong> The Software and its elements are owned by or licensed to the Company.
                    No rights granted beyond the Agreement.
                  </li>
                  <li>
                    <strong>Third-Party Rights:</strong> Respect all third-party intellectual property rights.
                  </li>
                </ul>
              </li>

              <li>
                <strong>No Refund Policy</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>No Refunds:</strong> All payments are non-refundable unless expressly stated otherwise.
                  </li>
                  <li>
                    <strong>Pricing Changes:</strong> The Company reserves the right to change pricing or payment
                    structures with notice.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Disclaimer of Warranties</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>Use at Your Own Risk:</strong> The Software is provided "as is" without warranties of any
                    kind.
                  </li>
                  <li>
                    <strong>No Guarantees:</strong> The Company does not guarantee uninterrupted, error-free, or
                    defect-corrected operation, nor accuracy of generated content.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Limitation of Liability</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>User Responsibility:</strong> The Company is not liable for user-generated content.
                  </li>
                  <li>
                    <strong>No Consequential Damages:</strong> No liability for indirect or punitive damages (e.g., lost
                    profits or data).
                  </li>
                  <li>
                    <strong>Maximum Liability:</strong> Total liability capped at the amount paid by you in the last 12
                    months.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Indemnification</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    You agree to indemnify the Company against any claims, damages, or expenses related to your use of
                    the Software, violations of this Agreement, or infringement of third-party rights.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Compliance with Laws</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    Ensure compliance with all applicable local, national, and international laws, including
                    intellectual property and data privacy regulations.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Termination</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>User Termination:</strong> Stop using the Software and delete your account to terminate this
                    Agreement.
                  </li>
                  <li>
                    <strong>Company Termination:</strong> The Company may terminate or suspend access for any reason,
                    especially for violations.
                  </li>
                  <li>
                    <strong>Effect of Termination:</strong> All licenses cease; relevant provisions survive termination.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Governing Law and Dispute Resolution</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>Governing Law:</strong> Governed by the laws of Ontario, Canada, and applicable Canadian or
                    U.S. federal laws.
                  </li>
                  <li>
                    <strong>Dispute Resolution:</strong> Initial resolution by negotiation, unresolved disputes
                    submitted to binding arbitration in Ontario, Canada.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Miscellaneous</strong>
                <ul class="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong>Severability:</strong> Invalid provisions will not affect the validity of the rest of the
                    Agreement.
                  </li>
                  <li>
                    <strong>Entire Agreement:</strong> Supersedes all prior communications regarding the Software.
                  </li>
                  <li>
                    <strong>No Waiver:</strong> Failure to enforce rights does not waive them.
                  </li>
                  <li>
                    <strong>Assignment:</strong> Users cannot assign rights; the Company can assign rights and
                    obligations.
                  </li>
                  <li>
                    <strong>Contact Information:</strong> Reach the Company at team@zeuxistalent.com or 215 Lonsdale
                    Road, Unit 1008, Toronto, Ontario.
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            @click="showTermsModal = false">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Optional custom styles */
</style>
