<script setup>
import { ref } from 'vue'
import genAiService from '@/services/gen-ai'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

// Reactive form data object
const formData = ref({
  name: '',
  email: '',
  password: '',
})

// Modal visibility
const showTermsModal = ref(false)

const submitForm = async () => {
  // Create a new object excluding termsAccepted from the payload
  const { termsAccepted, ...formPayload } = formData.value;

  console.log('Submitting form data:', formPayload); // Debug: Check form data

  try {
    // Send form data to the API
    const response = await genAiService.register(formPayload);
    console.log('Response:', response.data);

    // Check for success based on the response structure
    if (response.data?.status && response.data?.code === 200) {
      // Show success toast message if the response indicates success
      toastStore.success(response.data.message || 'Registration successful!');
    } else {
      // Show error toast message for unexpected scenarios
      toastStore.error(response.data?.message || 'Failed to register.');
    }
  } catch (error) {
    // Log the error and provide feedback to the user
    console.error('Error submitting form:', error);
    toastStore.error('An unexpected error occurred. Please try again later.');
  }
};


</script>

<template>
  <!-- <div class="relative flex flex-col items-center justify-center">

    <img src="/images/zeuxis.png" alt="Flowbite logo" class="w-30 h-25" />
  </div> -->
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
              aria-label="Sign Up">
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
        <h3 class="text-2xl font-bold mb-4">Terms and Conditions</h3>
        <div class="overflow-y-auto max-h-96 text-sm text-gray-700">
          <p>
            <strong>Last Updated: 23rd December 2024</strong>
          </p>
          <p>
            These Terms and Conditions (the “Agreement”) govern your access and use of the AI image
            and video generation software (the “Software”) provided by Zeuxis Canada Limited
            (“Company,” “we,” “us,” or “our”). By creating an account or otherwise accessing or
            using the Software, you (“User” or “you”) acknowledge that you have read, understood,
            and agree to be bound by the terms of this Agreement. If you do not agree with any of
            these terms, you are prohibited from using or accessing the Software. ______________ 1.
            Acceptance of Terms 1.1 Binding Agreement By accessing or using the Software, you
            represent that you have the legal capacity to enter into a binding contract with us and
            agree to abide by this Agreement. 1.2 Changes to Terms We reserve the right to modify or
            update this Agreement at any time, with or without prior notice. Any changes will be
            posted on our website or notified to you via email or in-Software prompts. Your
            continued use of the Software after any amendments constitutes your acceptance of the
            revised terms. ______________ 2. License and Use of the Software 2.1 License Grant
            Subject to your compliance with this Agreement, the Company grants you a limited,
            non-exclusive, non-transferable, revocable license to access and use the Software solely
            for your internal and lawful purposes. 2.2 Restrictions You agree not to: 1. Use the
            Software to create images or videos that are unlawful, harmful, or violate any law or
            regulation. 2. Use the Software to create images or videos that infringe upon the
            intellectual property rights of others, including but not limited to copyright,
            trademark, or publicity rights. 3. Attempt to reverse engineer, decompile, disassemble,
            or otherwise derive the source code from the Software. 4. Interfere with or disrupt the
            integrity, security, or performance of the Software. 5. Use the Software in any manner
            that may harm minors or any third party. 2.3 Prohibited Content By using the Software,
            you represent and warrant that you will refrain from generating, uploading,
            transmitting, or otherwise making available content that: 1. Is illegal, harmful,
            harassing, hateful, racist, defamatory, or otherwise objectionable. 2. Violates any
            third-party rights, including copyright, trademark, patent, trade secrets, privacy
            rights, or other proprietary rights. 3. Depicts violence or sexual content in a way that
            violates applicable laws or regulations. 4. Encourages conduct that is unlawful or that
            would give rise to civil liability. ______________ 3. User Accounts 3.1 Registration In
            order to use certain features of the Software, you may be required to register for an
            account. You agree to provide accurate, complete, and current information during
            registration and to update such information as needed. 3.2 Account Security You are
            solely responsible for maintaining the confidentiality of your account credentials and
            for any activity that occurs under your account. You agree to notify us immediately of
            any unauthorized access to your account. 3.3 Account Termination We reserve the right to
            suspend or terminate your account at any time, for any or no reason, including without
            limitation if we believe you have violated this Agreement, or engaged in conduct that we
            determine to be inappropriate or unacceptable. ______________ 4. User-Generated Content
            4.1 Ownership You retain all rights and ownership to the content you generate using the
            Software. We do not claim any ownership rights in your generated content. 4.2
            Responsibility for Content You are solely responsible for the content you create,
            generate, or share using the Software, and for any consequences arising from your use of
            such content. 4.3 License to Company By creating or generating content using the
            Software, you grant the Company a worldwide, non-exclusive, royalty-free license to
            host, store, reproduce, modify (for technical purposes, e.g. making sure the content is
            accessible on all devices), and display the content for the purpose of providing and
            improving the Software. 4.4 Monitoring We reserve the right (but have no obligation) to
            monitor, review, or remove content generated or uploaded using the Software at our sole
            discretion and at any time, without notice, for any reason, including to comply with
            applicable laws or regulations. ______________ 5. Intellectual Property 5.1 Company’s
            Intellectual Property All rights, title, and interest in and to the Software (including
            but not limited to text, graphics, images, logos, button icons, software, functionality,
            and other materials) are owned by or licensed to the Company. Except as expressly
            provided in this Agreement, nothing herein grants you any rights in or to the Company’s
            intellectual property. 5.2 Third-Party Rights All trademarks, service marks, trade
            names, trade dress, and related content, which are not owned by the Company, are the
            property of their respective owners. ______________ 6. No Refund Policy 6.1 No Refunds
            All fees and charges related to the Software and its use, if any, are non-refundable.
            This includes payments made for subscription fees, credits, licenses, or any other paid
            features. By making a payment, you acknowledge and agree that you are not entitled to a
            refund for any reason, unless expressly provided otherwise by us in writing. 6.2 Pricing
            and Changes The Company reserves the right to change its pricing, payment structure, or
            any features of the Software at any time. Such changes will become effective upon
            posting on the Software or on our website. ______________ 7. Disclaimer of Warranties
            7.1 Use at Your Own Risk Your use of the Software is at your own risk. The Software is
            provided on an “as is” and “as available” basis, without warranties of any kind, either
            express or implied. To the fullest extent permitted by law, the Company disclaims all
            warranties, express or implied, including but not limited to any implied warranties of
            merchantability, fitness for a particular purpose, or non-infringement. 7.2 No Guarantee
            of Accuracy or Availability The Company does not warrant that: 1. The Software will meet
            your specific requirements. 2. The operation of the Software will be uninterrupted,
            secure, or error-free. 3. Any defects in the Software will be corrected. 4. The content
            generated will be accurate, complete, or reliable. ______________ 8. Limitation of
            Liability 8.1 No Liability for User-Generated Content The Company is not liable for any
            content created, generated, or shared by users of the Software. You acknowledge and
            agree that you are solely responsible for the legality, reliability, and appropriateness
            of all content you generate. 8.2 Consequential Damages To the fullest extent permitted
            by applicable law, in no event shall the Company, its affiliates, directors, officers,
            employees, agents, or licensors be liable for any indirect, incidental, special,
            consequential, or punitive damages (including without limitation damages for loss of
            profits, goodwill, use, data, or other intangible losses), arising out of or related to
            your use or inability to use the Software. 8.3 Maximum Liability In no event shall the
            Company’s total liability to you for all claims arising from or relating to this
            Agreement or your use of the Software exceed the amount you paid to the Company (if any)
            for use of the Software during the twelve (12) months immediately preceding the claim.
            ______________ 9. Indemnification You agree to indemnify, defend, and hold harmless the
            Company, its affiliates, directors, officers, employees, agents, and licensors from and
            against any and all claims, liabilities, damages, losses, or expenses (including
            reasonable attorneys’ fees and costs) arising out of or in any way connected with your
            use of the Software, your violation of this Agreement, or your infringement of any
            third-party rights. ______________ 10. Compliance with Laws You agree to comply with all
            applicable local, state, provincial, national, and international laws, rules, and
            regulations in connection with your use of the Software, including but not limited to
            any intellectual property laws and data privacy regulations. ______________ 11.
            Termination 11.1 Termination by You You may terminate this Agreement at any time by
            ceasing to use the Software and, if applicable, by deleting your account. 11.2
            Termination by Company We may terminate this Agreement or suspend your access to the
            Software at any time for any or no reason, including if we believe you have violated the
            letter or spirit of this Agreement or if we believe it is necessary to protect our
            rights, third parties, or the public. 11.3 Effect of Termination Upon termination, all
            licenses granted to you herein will immediately cease, and you must stop using the
            Software. Any provisions of this Agreement intended by their nature to survive
            termination shall remain in effect. ______________ 12. Governing Law and Dispute
            Resolution 12.1 Governing Law This Agreement and any related disputes shall be governed
            by and construed in accordance with the laws of the Province of [Province Name, e.g.
            Ontario] and the laws of Canada, without regard to conflicts of law principles. Where
            applicable, U.S. federal law may also govern certain aspects, depending on your
            location. 12.2 Dispute Resolution Any dispute arising from or relating to this Agreement
            or the Software shall first be attempted to be resolved by negotiation in good faith
            between you and the Company. If the dispute cannot be resolved by negotiation, it shall
            be submitted to binding arbitration in Ontario, Canada pursuant to the rules of the
            applicable arbitration association. The award rendered by the arbitrator(s) shall be
            final and binding, and judgment on the award may be entered in any court having
            jurisdiction thereof. ______________ 13. Miscellaneous 13.1 Severability If any
            provision of this Agreement is held to be invalid, illegal, or unenforceable, that
            provision shall be construed in a manner consistent with applicable law to reflect, as
            nearly as possible, the original intentions, and the remaining provisions shall remain
            in full force and effect. 13.2 Entire Agreement This Agreement constitutes the entire
            agreement between you and the Company regarding your use of the Software and supersedes
            all prior or contemporaneous communications, whether electronic, oral, or written,
            between you and the Company regarding the Software. 13.3 No Waiver Our failure to
            enforce or exercise any provision of this Agreement or related right shall not
            constitute a waiver of that right or provision. 13.4 Assignment You may not assign or
            transfer this Agreement or any rights or obligations herein without our prior written
            consent. We may assign or transfer our rights and obligations under this Agreement at
            any time without restriction. 13.5 Contact Information If you have any questions,
            concerns, or comments about this Agreement or the Software, you may contact us at:
            Zeuxis Canada Limited 215 Lonsdale Road, Unit 1008, Toronto, Ontario
            team@zeuxistalent.com ______________ By using or accessing the Software, you acknowledge
            that you have read, understood, and agree to be bound by these Terms and Conditions. If
            you do not agree, you must not use the Software.
          </p>
          <!-- Add the rest of the terms content here -->
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
