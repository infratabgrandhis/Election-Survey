<template>
    <div>
        <v-subheader class="pa-1">Start Survey</v-subheader>
        <v-form class="pa-2"
                v-if="!isQuestionCardActive">
            <v-container>
                <v-layout row
                          wrap>
                    <v-text-field label="Name"
                                  type="text"
                                  class="full-width"
                                  v-model="name"
                                  :clearable="true"></v-text-field>
                    <v-text-field mask="phone"
                                  class="full-width"
                                  v-model="phone"
                                  label="Phone Number"></v-text-field>
                    <v-radio-group v-model="genderVal"
                                   row
                                   class="full-width">
                        <v-radio v-for="n in gender"
                                 :key="n"
                                 :column="false"
                                 :label="`${n}`"
                                 :value="n"></v-radio>
                    </v-radio-group>
                    <v-slider v-model="age"
                              :max="100"
                              :min="18"
                              :step="1"
                              label="Age"></v-slider>
                    <v-flex shrink
                            style="width: 43px;padding-top: 21px">
                        <label class="v-label theme--light">{{age}}</label>
                    </v-flex>
                    <v-flex>
                        <v-select :items="occupationList"
                                  v-model="occupationVal"
                                  label="occupation"></v-select>
                    </v-flex>
                    <v-radio-group v-model="voterCategoryVal"
                                   row
                                   class="full-width">
                        <v-radio v-for="n in voterCategoryList"
                                 :key="n"
                                 :column="false"
                                 :label="`${n}`"
                                 :value="n"></v-radio>
                    </v-radio-group>
                    <v-btn color="#1867c0"
                           @click="getQuestionData"
                           dark>Next
                        <v-icon dark
                                right>keyboard_arrow_right</v-icon>
                    </v-btn>
                </v-layout>
            </v-container>
        </v-form>
        <v-form v-else
                class="pa-2">
            <v-container>
                <v-layout row
                          wrap>
                    <p>
                        <b>{{currentQuestion.question}}</b>
                    </p>
                    <v-radio-group v-model="currentQuestionAns"
                                   v-if="currentQuestion && currentQuestion.options && !currentQuestion.multipleSelection"
                                   class="full-width">
                        <v-radio v-for="n in currentQuestion.options"
                                 :key="n"
                                 :column="false"
                                 :label="`${n}`"
                                 :value="n"></v-radio>
                    </v-radio-group>
                    <v-checkbox v-if="currentQuestion && currentQuestion.options && currentQuestion.multipleSelection"
                                v-model="currentQuestionAns"
                                v-for="n in currentQuestion.options"
                                :column="false"
                                :label="`${n}`"
                                :value="n"
                                :key="n">
                    </v-checkbox>
                    <v-textarea :placeholder="currentQuestion.placeholder"
                                :value="currentQuestionAns"
                                v-if="currentQuestion.type"
                                rows="1"
                                auto-grow
                                class="full-width"
                                hint="Enter Complaints and issues"></v-textarea>
                    <v-btn color="success"
                           @click="submitSurvey"
                           v-if="currentQuestion.isQuestionsOver">Submit</v-btn>
                    <v-btn color="#1867c0"
                           v-if="!currentQuestion.isQuestionsOver"
                           @click="getNextQuestion"
                           dark>Next
                        <v-icon dark
                                right>keyboard_arrow_right</v-icon>
                    </v-btn>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import config from '../config/firebase.json'
import axios from 'axios'
import _values from 'lodash/values'
import router from '../router.js'

export default {
    data() {
        return {
            name: '',
            phone:'',
            gender: ['Male', "Female"],
            genderVal:'',
            voterCategoryList: ['New_voter', "Existing_voter"],
            voterCategoryVal:'',
            age:18,
            occupationList:[],
            occupationVal:'',
            questionMeta:{},
            currentQuestion:{},
            isQuestionCardActive:false,
            currentQuestionAns:'',
            currentQuestionId:'',
            questionsWithAnswers:[]
        }
    },
    methods: {
        getOccupationList() {
            axios.get(config.urls.occupationList).then((result) => {
                this.occupationList = _values(result.data)[0].data || [];
            }).catch((err) => {
                this.errorCallback(err);
            })
        },
        errorCallback(err, color) {
            this.$store.dispatch('manipulateSnackData', {
                            txt: err.message,
                            color: err.color || 'error',
                            active: true
                        });
        },
        getQuestionMetaData() {
            if(config.urls.questionMeta) {
                axios.get(config.urls.questionMeta).then((result) => {
                    this.questionMeta = _values(result.data)[0] || {};
                }).catch((err) => {
                    this.errorCallback(err);
                })
            }
        },
        getQuestionData(event, id){
            const questionId = id || this.questionMeta.default;
            const url = config.urls.questionURL.replace('{question}', questionId);
            this.currentQuestionId = questionId;
            if(this.name && this.phone && this.genderVal && this.age && this.voterCategoryVal && this.occupationVal) {
                axios.get(url).then((result) => {
                    this.currentQuestion = _values(result.data)[0] || {};
                    this.isQuestionCardActive = true;
                    this.currentQuestionAns= (this.currentQuestion.multipleSelection) ? [] : '';
                }).catch((err) => {
                    this.errorCallback(err);
                })
            } else {
                this.errorCallback({"message":'All the above fields are mandatory to fill..'});
            }
        },
        getNextQuestion() {
            if(this.currentQuestionAns){
                let nextQuestionId = '';
                if(this.currentQuestion.willDynamicQuestionCome) {
                    const index = this.currentQuestion.options.indexOf(this.currentQuestionAns);
                    nextQuestionId = this.questionMeta[this.currentQuestionId+'_'+index];
                } else {
                    nextQuestionId = this.questionMeta[this.currentQuestionId];
                }
                this.questionsWithAnswers.push({
                    question:this.currentQuestion.question,
                    answer: this.currentQuestionAns,
                    questionId: this.currentQuestionId
                });
                this.getQuestionData({}, nextQuestionId);
            } else {
                this.errorCallback({"message":'Choose any value before go to next question.'})
            }
        },
        submitSurvey() {
            const state = this.$store.state;
            const url = config.urls.submitSurvey.replace('{uid}', state.authUser.uid);
            const payload = {
                name: this.name,
                phone:this.phone,
                gender:this.genderVal,
                age: this.age,
                occupation: this.occupationVal,
                voterCategory: this.voterCategoryVal,
                questionAndAnswers: this.questionsWithAnswers,
                constituency: state.authUser.constituency,
                mandal: state.mandalName,
                village:state.villageName,
                date:new Date().toGMTString()
            };
            axios.post(url, payload).then((result) => {
                    this.errorCallback({"message":'Successfully submitted survey', color: 'success'});
                    router.push('/');
                }).catch((err) => {
                    this.errorCallback(err);
                })
        }
    },
    created() {
        const state = this.$store.state;
        if(state.authUser.email) {
            if(state.mandalName && state.villageName) {
                this.getOccupationList();
                this.getQuestionMetaData();
            } else {
                this.errorCallback({"message":"First select Mandal and village before survey"});
                router.push('/');    
            }
        } else {
            router.push('/signin');
        }
    }
}
</script>

<style>
.full-width {
  width: 100%;
}
</style>


