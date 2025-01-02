<template>
  <div
    class="fixed top-0 right-0 h-screen bg-gray-50 shadow-lg rounded-l-3xl flex flex-col w-64 md:w-72 lg:w-80 xl:w-96 transition-transform transform translate-x-full lg:translate-x-0"
    :class="{ 'translate-x-0': isOpen }"
  >
    <!-- Logo -->
    <div class="px-6 py-4 flex justify-center">
      <img src="/images/zeuxis.png" alt="Zeuxis Logo" class="w-30 h-20" />
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 overflow-y-auto">
      <ul class="space-y-2 px-4">
        <li>
          <a
            href="#"
            class="flex items-center px-4 py-3 rounded-lg text-black-2 hover:bg-blue-600 hover:text-white group transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3 text-black-2 group-hover:text-white transition-all">
              <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21508 0.913451 7.4078C0.0051994 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.807 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0865C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6934 24 14.3734 24 12C24 8.8174 22.7357 5.76515 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0ZM12 22.2857C9.96568 22.2857 7.97704 21.6825 6.28557 20.5523C4.59409 19.422 3.27575 17.8156 2.49724 15.9362C1.71874 14.0567 1.51505 11.9886 1.91193 9.99335C2.3088 7.99812 3.28842 6.16538 4.72691 4.7269C6.16539 3.28842 7.99813 2.3088 9.99336 1.91192C11.9886 1.51505 14.0567 1.71874 15.9362 2.49724C17.8156 3.27574 19.4221 4.59409 20.5523 6.28556C21.6825 7.97704 22.2857 9.96568 22.2857 12C22.2857 14.7279 21.202 17.3441 19.2731 19.2731C17.3442 21.202 14.7279 22.2857 12 22.2857ZM17.0743 5.77714L9.79715 9.42857C9.63275 9.51548 9.49834 9.64989 9.41143 9.81428L5.77715 17.0743C5.71305 17.2051 5.68335 17.3501 5.69085 17.4955C5.69835 17.641 5.7428 17.7822 5.82 17.9057C5.89721 18.0292 6.00462 18.1311 6.13209 18.2015C6.25957 18.272 6.40291 18.3089 6.54858 18.3086C6.67918 18.3091 6.80818 18.2798 6.92572 18.2229L14.2029 14.5714C14.3673 14.4845 14.5017 14.3501 14.5886 14.1857L18.2229 6.90857C18.3022 6.74787 18.3291 6.56634 18.2999 6.38953C18.2707 6.21272 18.1868 6.04951 18.06 5.92286C17.9314 5.79887 17.7672 5.71818 17.5905 5.69205C17.4138 5.66593 17.2333 5.69568 17.0743 5.77714ZM13.1829 13.1829L8.46 15.54L10.8171 10.8171L15.54 8.46L13.1829 13.1829Z" fill="black"/>
            </svg>
            Explore
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded-lg transition-all space-x-2 group"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3 text-black-2 group-hover:text-white transition-all">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7476 17.2505C13.4253 15.9282 12.1123 16.4439 10.9766 17.8058L5.79309 24.0224C4.73148 25.2955 2.90158 25.295 1.80333 24.1967C0.70509 23.0985 0.704554 21.2686 1.97767 20.207L8.19426 15.0234C9.55616 13.8878 10.0718 12.5748 8.74952 11.2525C7.88645 10.3894 7.88645 8.97707 8.74952 8.11399L15.8635 1L25 10.1366L17.8861 17.2505C17.023 18.1136 15.6106 18.1136 14.7476 17.2505Z" stroke="black" stroke-width="1.5" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.35889 21.8662L4.13401 18.6413" stroke="black" stroke-width="0.975609" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.1333 15.7383L16.2499 12.8549M13.1455 9.75053L10.2619 6.86692" stroke="black" stroke-width="1.5" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23.0005 8.4816L21.7921 9.68994" stroke="black" stroke-width="1.5" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21.1729 6.65463L18.5331 9.29443" stroke="black" stroke-width="1.5" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.3457 4.82721L17.5338 6.63916" stroke="black" stroke-width="1.5" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17.5181 2.99972L16.3098 4.20801" stroke="black" stroke-width="1.5" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.6978 11.3027H14.6974" stroke="black" stroke-width="0.975609" stroke-miterlimit="2.6131" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Create
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center px-4 py-3 rounded-lg text-black-2 hover:bg-blue-600 hover:text-white group transition-all"
          >
            <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="fill-current text-[#000000] group-hover:text-white transition-colors">
              <g clip-path="url(#clip0_2398_2269)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.76182 0H16.6136L17.2936 0.558491C17.6645 0.875472 18.0664 1.31321 18.1745 1.53962C18.3291 1.82642 18.3909 2.56604 18.3909 5.88679H24.8509C28.4364 5.88679 31.5427 5.94717 31.8364 6.03774C32.13 6.11321 32.64 6.43019 32.9645 6.74717C33.2891 7.06415 33.6136 7.53208 33.7064 7.77358C33.7836 8.04528 33.8609 10.9887 33.8918 14.8679C33.9227 20.8755 33.8918 21.5849 33.66 22.234C33.4745 22.7019 33.15 23.1245 32.0682 24H17.3091L16.7064 23.5925C16.3664 23.3509 15.9336 22.9434 15.7327 22.6566C15.4082 22.1887 15.3773 21.9472 15.3 18.1132H2.24091L1.54545 17.766C1.15909 17.5698 0.664545 17.1472 0.0154545 16.2264L0 9.16226C0 3.63774 0.0463636 2.00755 0.200909 1.61509C0.324545 1.35849 0.710909 0.875472 1.08182 0.573585L1.76182 0ZM1.20545 1.93208L1.25182 11.3811C4.23455 8.40755 5.20818 7.54717 5.33182 7.54717C5.47091 7.53208 6.41364 8.39245 7.46455 9.43396C8.5 10.4755 9.41182 11.3208 9.47364 11.3208C9.53545 11.3208 10.2155 10.5208 10.9882 9.53962C11.7609 8.55849 12.5027 7.71321 12.6109 7.65283C12.7345 7.59245 12.9818 7.63774 13.1827 7.7434C13.3682 7.84906 14.2645 8.70943 15.1455 9.64528C16.0418 10.5811 16.8918 11.3962 17.0464 11.4717C17.2936 11.6075 17.3091 11.4264 17.3091 8.73962V5.88679C16.7682 6.15849 16.1036 6.24906 15.4545 6.24906C14.5427 6.24906 14.1255 6.17359 13.4609 5.8717C13.0127 5.67547 12.3791 5.23774 12.07 4.90566C11.7609 4.57359 11.3436 3.90943 11.1582 3.42642C10.9727 2.9434 10.8182 2.21887 10.8182 1.81132V1.0566H2.21L1.20545 1.93208ZM12.0545 1.91698C12.0545 2.52075 12.1627 2.98868 12.41 3.4566C12.6109 3.84906 13.0436 4.33208 13.43 4.58868C14.0327 5.01132 14.1873 5.04151 15.3618 5.04151C16.4436 5.04151 16.7064 4.99623 16.9845 4.73962C17.2473 4.49811 17.3091 4.2717 17.3091 3.50189C17.3091 2.98868 17.2009 2.32453 17.0618 2.02264C16.9382 1.73585 16.6291 1.40377 16.3664 1.26792C16.0418 1.11698 15.3927 1.04151 13.9709 1.04151H12.0391L12.0545 1.91698ZM18.3909 7.09434C18.3909 15.5925 18.36 15.9698 18.0818 16.5585C17.8964 16.9509 17.5255 17.3736 17.1545 17.6151L16.5209 18.0377C16.5364 21.3887 16.5827 21.7358 16.8455 22.1434C17.0155 22.4151 17.3245 22.7019 17.5409 22.7925C17.7727 22.883 20.5236 22.9434 24.65 22.9434C29.2864 22.9434 31.4809 22.8981 31.7282 22.7774C31.9136 22.6868 32.1918 22.4604 32.3309 22.2792C32.5782 21.9925 32.6091 21.3736 32.6091 14.9736V8L31.7591 7.13962C25.7782 6.98868 22.95 6.95849 21.6364 6.95849C20.3227 6.97358 19.0555 7.01887 18.8236 7.03396L18.3909 7.09434ZM1.26727 13.0566C1.08182 14.7925 1.09727 15.3811 1.22091 15.7434C1.31364 16.0604 1.57636 16.4528 1.80818 16.6189C2.17909 16.8755 2.45727 16.9208 3.70909 16.9057L5.17727 16.8906C7.68091 13.7208 8.48455 12.6642 8.57727 12.4981C8.70091 12.2566 8.48455 11.9849 7.10909 10.6415C6.21273 9.76604 5.40909 9.0566 5.33182 9.0717C5.23909 9.0717 4.29636 9.96227 3.23 11.0642L1.26727 13.0566ZM9.93727 12.7849C8.31455 14.8377 6.93909 16.6189 6.89273 16.7245C6.8 16.8604 7.77364 16.9057 11.4982 16.9057H16.2118C17.2009 16.0453 17.2164 15.9849 17.2627 14.6868L17.3091 13.3585L12.8891 9.04151L9.93727 12.7849ZM19.9518 8.75472C20.06 8.75472 22.4709 10.0679 25.3145 11.683C28.8845 13.6906 30.5073 14.6868 30.5382 14.883C30.5691 15.0491 30.4609 15.2755 30.3064 15.4264C30.1518 15.5623 28.1273 16.7396 25.7782 18.0528C23.4445 19.3509 21.2655 20.5887 20.9564 20.7698C20.6318 20.966 20.2145 21.117 19.6736 21.0566L19.6582 15.0943C19.6427 11.8189 19.6582 9.04151 19.6891 8.95094C19.72 8.84528 19.8436 8.75472 19.9518 8.75472ZM20.6936 14.9434C20.6782 17.6302 20.74 19.4566 20.8327 19.4415C20.91 19.4113 22.7182 18.4151 24.8355 17.2075C26.9682 16 28.7145 14.9887 28.7145 14.9434C28.7145 14.8981 27.2773 14.0679 25.5155 13.1019C23.7536 12.1208 21.9455 11.1094 21.4973 10.8679L20.6936 10.4151V14.9434Z" fill="black"/>
              </g>
              <defs>
                <clipPath id="clip0_2398_2269">
                  <rect width="34" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Image to Video
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center px-4 py-3 rounded-lg text-black hover:bg-blue-600 hover:text-white group transition-all"
          >
            <svg
              class="w-6 h-6 mr-3 text-black-2 group-hover:text-white transition-all"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16s1.5-2 3-2 3 2 5 2 3-2 5-2 3 2 5 2" />
            </svg>
            Text to Video
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white group transition-all"
          >
            <svg
              class="w-6 h-6 mr-3 text-gray-700 group-hover:text-white transition-all"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
            Face Swap
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white group transition-all"
          >
            <svg
              class="w-6 h-6 mr-3 text-gray-700 group-hover:text-white transition-all"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18" />
            </svg>
            Templates
          </a>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-4">
      <ul class="space-y-2">
        <li>
          <a
            href="#"
            class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white group transition-all"
          >
            <svg
              class="w-6 h-6 mr-3 text-gray-700 group-hover:text-white transition-all"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h2m-2 4h2m0 4h14m2-8h2m-2-4h2M6 8h6m-6 8h6" />
            </svg>
            Subscribe
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white group transition-all"
          >
            <svg
              class="w-6 h-6 mr-3 text-gray-700 group-hover:text-white transition-all"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 0C5.36761 0 0 5.367 0 12C0 18.6323 5.367 24 12 24C18.6324 24 24 18.633 24 12C24 5.36761 18.633 0 12 0ZM12 22.3256C6.30647 22.3256 1.67442 17.6936 1.67442 12C1.67442 6.30642 6.30647 1.67442 12 1.67442C17.6936 1.67442 22.3256 6.30642 22.3256 12C22.3256 17.6936 17.6936 22.3256 12 22.3256Z" fill="black"/>
              <path d="M11.6433 15.1846C10.9799 15.1846 10.4429 15.7374 10.4429 16.4008C10.4429 17.0485 10.9641 17.6171 11.6433 17.6171C12.3226 17.6171 12.8596 17.0485 12.8596 16.4008C12.8596 15.7374 12.3067 15.1846 11.6433 15.1846Z" fill="black"/>
              <path d="M11.851 5.97607C9.71857 5.97607 8.73926 7.23978 8.73926 8.09271C8.73926 8.70875 9.26051 8.99309 9.68698 8.99309C10.54 8.99309 10.1925 7.77678 11.8036 7.77678C12.5934 7.77678 13.2252 8.12431 13.2252 8.85092C13.2252 9.70386 12.3407 10.1935 11.8194 10.6358C11.3613 11.0306 10.7611 11.6783 10.7611 13.0367C10.7611 13.8581 10.9823 14.095 11.6299 14.095C12.4038 14.095 12.5618 13.7475 12.5618 13.4473C12.5618 12.626 12.5776 12.1521 13.4464 11.4729C13.8728 11.1412 15.2154 10.0671 15.2154 8.58232C15.2154 7.09756 13.8728 5.97607 11.851 5.97607Z" fill="black"/>
            </svg>
            Help
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false); // State for mobile toggle

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>


