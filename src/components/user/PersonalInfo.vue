<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const userData = computed(() => {
    return store.state.auth.userLogin;
});
</script>
<template>
    <ul class="list-group">
        <li class="list-group-item">
            <p class="my-0 fs-4 fw-semibold">Personal Info</p>
            <p>
                These details will be used for all the Meredith profiles associated with
                your email address. By filling out this information, you will receive a
                more personalized experience across all Meredith websites
            </p>
        </li>
        <li class="list-group-item">
            <p class="my-0 fs-5 fw-semibold">My Basic Info</p>
            <div class="d-flex mt-4">
                <div class="pe-4 me-4">
                    <p>Firstname</p>
                    <p>Last Name</p>
                    <p>Username</p>
                    <p>Email</p>
                </div>
                <div class="ps-4 ms-4">
                    <p>{{ userData.firstname }}</p>
                    <p>{{ userData.lastname }}</p>
                    <p>{{ userData.username }}</p>
                    <p>{{ userData.email }}</p>
                </div>
            </div>
        </li>
    </ul>
</template>