<template>
  <div class="flex items-center justify-center bg-white z-20">
    <!-- Sidebar container adjusted for responsiveness -->
    <div class="w-64 bg-white shadow rounded-lg" >
      <ul class="divide-y divide-white">
        <li>
          <a
            @click="navigateTo('/profile')"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-orange hover:text-black-2 cursor-pointer rounded-lg transition-all space-x-2 group"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect width="19" height="19" fill="url(#pattern0_778_2125)"/>
              <defs>
                <pattern id="pattern0_778_2125" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlink:href="#image0_778_2125" transform="scale(0.02)"/>
                </pattern>
                <image id="image0_778_2125" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAADKgAwAEAAAAAQAAADIAAAAARkSbnAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA5dJREFUaAXtmDlvU0EUhWMECBI2RRAJCUHSkJIgIUpMDR378gcgFIgeGkD8BCpIgpBAQA9tLPY1iCIsBQkFASJQ2CoQy3eiOLHH4/fuPI+NkXylI/vOnLvNmzczb9raWtIagdYIJI1ALqkzQ98qbPKgD/QC6UuA5DuYBK/ACCiAj6BpZAWZHAH3wG/wxwhx74J+sBz8M1EBZ8AXYE2+Gu8zPk6Dhhd0kKDvIxTgFvYOn/tB3UXz/SJwE4itXyBGR72q6cSx5nTspKv5e0isrtjFaPV53sAiisWNElOxo4imk0an6LzRv/eJ3R6jEs3XRifvxhuotRCtTq5Tq659QnvL2RloZEP2GTfOPuwzifaJrEvsC2w3eaJupu0lcJO06BPYZdpntNlZAricMeySXlCtRG8y+tamGSR6Gtpt3SQt+k5DpN0ZfSunoKeis5MlaZej48oCkCYLIXwFrr1FP5zmvLRfL6nFqct5Vuok5b+4rr1Fv5Pid7Zb8zvr6vJ61kv6nzEolsRdzi/sVrru57kN6HmQ87RbmrohrTMQe+CIm0WUs3IsE18hfWWMMEUDcNxgcsLASaKYcryGB/dxhupHE7I4FsH/lQT/s12FCIFU+HWwDayewXZ+b4DQQfHxh/GTKk9g+Iybqe2xW4XvHXE5/4XuK0S3Hc0u2kzLxFeIDorNLh/cBOe7Deg6nYbISciXwY8QoxKujisHQMiSrLuxVNkFw/pia4WLJTdxZI27ww3qm1rDkHREsci4hWTkWI83yq1iAH2F6BrzgTH4GiPPQltrIcHRgfaTkTt9jWl5zHovuq1OE3g99P0ElpiHEvxUdOnjxfphdQvuogoP9obFUHU0txQxBS/ow0pp6LPS4lycR2A9CJVeDLRLW+NohQwWVa67WGsQTY0BkAe+d4/maVHfVjAErNNJObwFy4BXct7WuUZdKF+aU83/vsF8CsaBPn8lGhi9CxvAUhAqezG4GmpUyh9CsT6VevHOlSaU9X8HhlqO65Vkml8tt+1Zk3ft9B0/CtKCxu5XzIrvcze5UL0Tg9sgdrLV/GkWJF30heZfxtcjHgTVgsdqP0+MaNOprAJH0YXyBIiVeNGPltg9Tqy6q1pOTwHrCaCYrO93Cj/a7KruE/TVXVRQP9AxQ5dnvkR9beLqndMVqHzUJGkbYqhzrTBbwEagI0sXKG5+2iQngT6KRkABmE+xcFvSGoHWCNQwAn8BhXRuQA0vHUAAAAAASUVORK5CYII="/>
              </defs>
            </svg>
            <span>Manage Profile</span>
          </a>
        </li>

        <li>
          <a
            @click="navigateTo('/subscription')"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-orange hover:text-black-2 cursor-pointer rounded-lg transition-all space-x-2 group"
          >
            <svg
              width="19"
              height="21"
              viewBox="0 0 19 21"
              xmlns="http://www.w3.org/2000/svg"
              class="fill-current text-[#000000] group-hover:text-black-2 transition-colors"
            >
              <g clip-path="url(#clip0_2242_871)">
                <path
                  d="M8.98018 0.134343L8.84188 0.265152C8.58299 1.74646 8.42695 2.58081 8.32765 3.07576C8.2319 3.57071 8.0794 4.26364 7.99074 4.61364C7.90563 4.96364 7.72121 5.58232 7.58645 5.99242C7.44814 6.40252 7.26728 6.8798 7.18216 7.05303C7.08286 7.25455 6.9481 7.45606 6.82043 7.59747C6.70695 7.72121 6.5119 7.89091 6.38422 7.97222C6.25656 8.05707 5.99412 8.20202 5.79907 8.30101C5.60402 8.39646 5.182 8.5803 4.85928 8.70758C4.53655 8.83485 3.98686 9.02576 3.63577 9.13535C3.28468 9.24141 2.66406 9.41818 2.25268 9.52778C1.84484 9.63737 1.22068 9.80707 0.869586 9.90252C0.415648 10.0263 0.20641 10.097 0.149668 10.1535C0.103565 10.1995 0.0503692 10.2914 0.0290909 10.3586C0.000719717 10.4505 0.000719717 10.5212 0.0290909 10.6343C0.0539156 10.7192 0.114204 10.8182 0.170947 10.8641C0.227689 10.9101 0.440472 10.9879 0.709998 11.0586C0.954699 11.1258 1.58596 11.2955 2.11082 11.4369C2.63924 11.5818 3.37334 11.7939 3.74216 11.9141C4.11453 12.0343 4.65713 12.2288 4.94794 12.3455C5.24229 12.4621 5.66431 12.653 5.88773 12.7662C6.11115 12.8758 6.39486 13.0419 6.51899 13.1303C6.63957 13.2187 6.80625 13.3778 6.88781 13.4803C6.96583 13.5793 7.11124 13.8232 7.20344 14.0177C7.29565 14.2121 7.46942 14.6576 7.58645 15.0076C7.70348 15.3576 7.87371 15.9268 7.96237 16.2732C8.05103 16.6162 8.19998 17.2914 8.29573 17.7758C8.39148 18.2566 8.55462 19.1192 8.65746 19.6919L8.84188 20.7348C9.10076 20.9859 9.13622 21 9.29227 21C9.41048 21 9.50505 20.9764 9.57598 20.9293C9.63272 20.8904 9.7001 20.8268 9.71783 20.7879C9.73911 20.749 9.83132 20.2682 9.93062 19.7167C10.0264 19.1687 10.1682 18.4086 10.2462 18.0303C10.3243 17.652 10.4342 17.1253 10.498 16.8636C10.5583 16.602 10.6789 16.1318 10.764 15.8207C10.8491 15.5096 10.9945 15.0394 11.0832 14.7778C11.1719 14.5162 11.3243 14.1414 11.4201 13.947C11.5194 13.7455 11.6648 13.5121 11.7641 13.4025C11.8563 13.3 12.0372 13.1444 12.1648 13.0596C12.2925 12.9783 12.6117 12.8051 12.8741 12.6813C13.1366 12.554 13.5444 12.3808 13.7785 12.2924C14.0125 12.204 14.5232 12.0308 14.9133 11.9035C15.3034 11.7763 16.0375 11.5677 16.5446 11.4404C17.0518 11.3131 17.6263 11.1611 17.8213 11.101C18.0164 11.0409 18.2434 10.9596 18.3285 10.9207C18.4242 10.8783 18.4987 10.8111 18.5342 10.7404C18.5767 10.6591 18.5874 10.5707 18.5732 10.447C18.559 10.3162 18.5271 10.2455 18.4526 10.1712C18.3746 10.097 18.2398 10.0439 17.8213 9.93081C17.5305 9.85303 16.9135 9.68687 16.456 9.56313C15.9985 9.43939 15.385 9.26263 15.0906 9.17424C14.7998 9.08232 14.3423 8.92677 14.0799 8.83131C13.8175 8.73232 13.3706 8.54848 13.0869 8.42475C12.8032 8.29747 12.4698 8.13485 12.3422 8.06061C12.2145 7.98636 12.0265 7.84848 11.9201 7.75657C11.8173 7.66111 11.6613 7.4702 11.5761 7.33586C11.4946 7.20151 11.3669 6.95404 11.296 6.78788C11.225 6.62172 11.0796 6.23283 10.9768 5.92172C10.8704 5.61061 10.7215 5.09444 10.6399 4.77273C10.5583 4.45101 10.4377 3.91717 10.3704 3.58838C10.303 3.2596 10.154 2.46414 10.037 1.82071C9.92352 1.18081 9.81004 0.565657 9.78521 0.459596C9.7533 0.311111 9.71429 0.233333 9.60789 0.134343C9.48732 0.0141414 9.44831 0 9.29227 0C9.13977 0 9.10076 0.0141414 8.98018 0.134343Z"
                />
              </g>
              <defs>
                <clipPath id="clip0_2242_871">
                  <rect width="18.6186" height="21" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>Subscription</span>
          </a>
        </li>

        <li>
          <a
            @click="navigateTo('/profile')"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-orange hover:black-2 cursor-pointer rounded-lg transition-all space-x-2 group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect width="24" height="24" fill="url(#pattern0_778_2060)"/>
              <defs>
                <pattern id="pattern0_778_2060" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlink:href="#image0_778_2060" transform="scale(0.0208333)"/>
                </pattern>
                <image id="image0_778_2060" width="48" height="48" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAADCgAwAEAAAAAQAAADAAAAAA6LhYOwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtZJREFUaAXtWE1LVVEUVQnKRoFhWjgohSKkUCEaxCsaRBHVWJ3UIKc2Kei3FE7Fn+BAHBSN0qAgTMGekz4nNbAM+1pL74alvPtx7rnv+ISzYXH222fvtffZ975zz71tbVFiB2IHYgdiBzw60O4RmxfaD4dridMsxtW8gFaaH0MxG8C/BNRHgX0h51DlT8CKt/EHbJxrSTmEqiaBt4AVzHEBWNxlo88DgDEtIZdRRR3Qwk2/BfvtlLk12K8Aeyp3kf03YAVzXAfmgUcANwniMUAb59SXsfeAPZGbyKrFf8Dv+0BnRjWHMTcBfARsIeQgV1A5gmws2Ip4Dv2oQwX0ZYzFk4ucweQhMlly7u9lkjOGscZDzmDyDpks8bhHVsYaz5IHj1NolyTlA+qgU/ROZ8bqM8PlNtxi6tjJV+jXefHiHv9LfruqjH0lQc4PujIL6JWEVZxv6sJ3TPRCapkF6GX+UihLtpNy8PZ0Et8FfHXK1thZObQ5jb13Wcss4KRwaPfE7KQqh3IXIimzgFPCvCZ6WbUugXyHaLp8Rgbbu7sryMY/rvHxiNFUOQF2S8bHf1XyCUTGyxyFxfUWuirMb0T3VV8LQU30XNV1AaPCOCe6r6pcfB1tirAzfwFeah6BnXcMxKQJ/7x/AHIzxyWgUuFb1TfA7tPpStm3yWaEn7nuVJXjIog2hZy7kNMfrWAhffDjM8GaxJwXCsZmur0Q0lXoQ5nefpPDCH8P2CL40uMlg4g2Mh57q7zv0wrjg1KP2GfTHGk/kDWJOe02P4PwCoQW1sBPMQ0lbxvtaRgV1qjHd+fMA4hYAew2Cj0uI3eQ8xE7w6v5HbBFXqcxkRsYzc4tMu/KW1zwcUoK5UesJwn0g9bT4FU5JDwOXz2YWddt5AHQ6552qKW06xlE8mXfirbxJWynS7OmBLan2H3N5K0BIwAXwK/UzxIdQ5TYgdiB2IHYgRbpwH9cC9s7DoW/4AAAAABJRU5ErkJggg=="/>
              </defs>
            </svg>
            <span>Updates</span>
          </a>
        </li>

        <li>
          <a
            @click="navigateTo('/profile')"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-orange hover:text-black-2 cursor-pointer rounded-lg transition-all space-x-2 group"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect width="19" height="19" fill="url(#pattern0_778_2061)"/>
              <defs>
                <pattern id="pattern0_778_2061" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlink:href="#image0_778_2061" transform="scale(0.0416667)"/>
                </pattern>
                <image id="image0_778_2061" width="24" height="24" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAABigAwAEAAAAAQAAABgAAAAA0bpBmgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAdpJREFUSA3dlMkuREEUhjvGBd4AWwn9DtrCVhCxZClEDC8hIjyFYSESiYSlrQUbTWjTEwiJYcEG/3fVkUqpO7DsP/n7VJ+x7qlTVSrVO1r0gePillgTXx1Zb4rY8PkXRhV1J37m8Fb2EbEwGuS5IlriU63nxF6xzbFPcl6siua3rDWxubDkb/KcErOCsE2L+FKIIpmgLTgS0O95dmm9Iz477kr2iIaKFlZk2JSh5LCs5+zcQPIH0Vph8lE6bIYZLbDdiM2m9CUTgQM999vCztHvi52OB063LWlo1OJMxHfMlL5kFDFyoD5oC3qSG9g5uidTOLng9BuBPvl75YxMSx665UCB+8CR6UJfC/TJX9tpR8zo6Vq1pl0kWvX0LIlFT65fKFKgSVF7IkkOxfAWZxYo0qI1l/xIMvalZWf/aZE/LScygsFvEf2ddNoJyZeIh8UeR2zJw8WnV0W/cMw3pmNMz0VyRMeUfvJw4cD1jwEbjGFWSmzXYvSiEcSriBPXviKGSCswIMd38UMcCoPC/zxYVoTrz6enARs7JzkxS2Iu6L8VIYjrzw3lErU7liUXRes5Oyf5n86OV5GHy9qSJul5blvkEwWHxUTwtlyKjCa8ENdFbKkHKlsd4Aug2I8fnrZjlQAAAABJRU5ErkJggg=="/>
              </defs>
            </svg>
            <span>Get Help</span>
          </a>
        </li>

        <li>
          <router-link
            :to="{
              path: '/feedbackpage',
              //query: { mode: 'video', activeFunctionality: 'Templates' },
            }"
            class="flex items-center px-3 py-2 text-black-2 hover:bg-orange hover:text-black-2 cursor-pointer rounded-lg transition-all space-x-2 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 mr-3 fill-current text-[#000000] group-hover:text-black-2 transition-all">
              >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 20.25c4.556 0 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75 3.75 7.444 3.75 12c0 1.074.197 2.1.555 3.045l-.805 3.221a.75.75 0 00.91.91l3.22-.806A8.235 8.235 0 0012 20.25z"
              />
            </svg>
            Feedback
          </router-link>
        </li>

        <li>
          <a
            @click="logout"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-orange hover:text-black-2 cursor-pointer rounded-lg transition-all space-x-2 group"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect width="18" height="18" fill="url(#pattern0_778_2128)"/>
              <defs>
                <pattern id="pattern0_778_2128" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlink:href="#image0_778_2128" transform="scale(0.02)"/>
                </pattern>
                <image id="image0_778_2128" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAADKgAwAEAAAAAQAAADIAAAAARkSbnAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAbBJREFUaAXtWctOw0AMLAjxATwlOPMTiEt/jsdv8AtwROLAGQECLj0DR74ACcabDjLZEjXbEWwqW5p4693Oju2kjZLRKCwqEBWICgy1AusQfga8AZ+V4xX6TgHTnJlN1J5AW99JlgUClqUtPJw1KY61BZV+Ns3JVjiANzIzH2si+iP3UjAnvasKpho4IpEauuA1REd8NWoYR0dq6ILXEB3x1ahhXNKRfQi/BS5qSIAa1jiY0+9h3TVwALzP+Z0/X8Ybt9823sXEM2Dr7oANoNS4l8JnGkiaTSCwAzwBtuYe2AQWMe6l8JkOkrYnthF4BGz+AdgCFjXupfCZFpL6CZ8E5/v6S084Hffl6FqfKEt+tWboqivErNuqfFcGe2oxqaW42JnMUvz8Mhn7Q5wAdhpeMVjgeRorfNq+78Vuz7zGgP0xfiSGSg7+iYlVx8zHmoj+yL0UzPEURVFFOUffa0QuQEUYiagqqeKJjqgqqeKJjqgqqeLxHbHbD7Ojxg3i+P2ixydyPpV+A6+4meviUFWJmn/w2YtFeyfHV3BdQv577gU6jwHTHBYViApEBQZYgS/l+Ylj9f61cwAAAABJRU5ErkJggg=="/>
              </defs>
            </svg>
            <span  >Log Out</span>
          </a>
        </li>

      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (url) => {
  console.log(`Navigating to: ${url}`)
  router.push(url)
}

const logout = () => {
  // Clear user-related data (e.g., authentication token)
  localStorage.removeItem('authToken') // Adjust the key as per your app
  sessionStorage.clear() // Optional: Clear session
  localStorage.clear()
  // Redirect to login page
  router.push('/')
}

</script>

