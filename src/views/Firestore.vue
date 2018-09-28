<template>
    <div>
        <v-text-field v-model="firstName"
                      placeholder="FirstName"></v-text-field>
        <v-text-field v-model="lastName"
                      placeholder="lastName"></v-text-field>
        <v-text-field v-model="age"
                      placeholder="age"></v-text-field>
        <v-text-field v-model="id"
                      placeholder="id"></v-text-field>
        <v-btn color="Success">Submit</v-btn>
    </div>
</template>

<script>
import { db } from '../fire';

export default {
    data() {
        return {
            firstName:'',
            lastName:'',
            age: '',
            id: ''
        }
    },
    methods: {
        test() {
            db.collection("users").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                });
            });
        }
    },
    created() {
        this.test();
    }
}
</script>
