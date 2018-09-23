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
                    <v-flex>
                        <v-select :items="ageList"
                                  v-model="age"
                                  label="Age"></v-select>
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
                                v-model="currentQuestionAns"
                                v-if="currentQuestion.type"
                                rows="1"
                                auto-grow
                                class="full-width"
                                hint="Enter Complaints and issues"></v-textarea>
                    <v-btn color="success"
                           @click="submitSurvey"
                           v-if="currentQuestion.isQuestionsOver">Submit</v-btn>
                    <v-btn color="#1867c0"
                           v-if="currentQuestionIndex !== 0 "
                           @click="getPreviousQuestion"
                           dark>Back
                    </v-btn>
                    <v-btn color="#1867c0"
                           v-if="!currentQuestion.isQuestionsOver"
                           @click="getNextQuestion"
                           dark>Next
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
            ageList:[],
            age:'',
            occupationList:[],
            occupationVal:'',
            questionMeta:{},
            currentQuestion:{},
            isQuestionCardActive:false,
            currentQuestionAns:'',
            currentQuestionId:'',
            currentQuestionIndex:0,
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
        getAgeList() {
            axios.get(config.urls.ageList).then((result) => {
                this.ageList = _values(result.data)[0].data || [];
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
        setCurrentQuestionAnswer(newValue) {
            let defaultData = (this.currentQuestion.multipleSelection) ? [] : '';
            let previousque = this.questionsWithAnswers[this.currentQuestionIndex];
            this.currentQuestionAns = (previousque)?previousque.answer : defaultData;
        },
        getQuestionData(event, id){
            const questionId = id || this.questionMeta.default;
            const url = config.urls.questionURL.replace('{question}', questionId);
            this.currentQuestionId = questionId;
            if(this.name && this.genderVal && this.age && this.voterCategoryVal && this.occupationVal) {
                if((this.phone && this.phone.length === 10) || !this.phone ) {
                    axios.get(url).then((result) => {
                        this.currentQuestion = _values(result.data)[0] || {};
                        this.isQuestionCardActive = true;
                        this.setCurrentQuestionAnswer();
                    }).catch((err) => {
                        this.errorCallback(err);
                    })
                } else {
                    this.errorCallback({"message":"phone number not in valid format"})
                }
                
            } else {
                this.errorCallback({"message":'All the above fields are mandatory to fill..'});
            }
        },
        getPreviousQuestion() {
            this.currentQuestionIndex = this.currentQuestionIndex-1;
            let previousque = this.questionsWithAnswers[this.currentQuestionIndex];
            this.getQuestionData({}, previousque.questionId);
        },
        getNextQuestion() {
            if(this.currentQuestionAns.length > 0){
                let nextQuestionId = '';
                if(this.currentQuestion.willDynamicQuestionCome) {
                    const index = this.currentQuestion.options.indexOf(this.currentQuestionAns);
                    nextQuestionId = this.questionMeta[this.currentQuestionId+'_'+index];
                } else {
                    nextQuestionId = this.questionMeta[this.currentQuestionId];
                }
                this.questionsWithAnswers[this.currentQuestionIndex] = {
                    question:this.currentQuestion.question,
                    answer: this.currentQuestionAns,
                    questionId: this.currentQuestionId
                };
                this.currentQuestionIndex = this.currentQuestionIndex+1;
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
                date:new Date().toGMTString(),
                feedback:this.currentQuestionAns
            };
            if(payload.mandal === config.aliasNames.mandalAliasName) {
                payload.mandalAlias = state.mandalAliasName;
            }
            if (payload.feedback) {
                axios.post(url, payload).then((result) => {
                    this.errorCallback({"message":'Successfully submitted survey', color: 'success'});
                    router.push('/');
                }).catch((err) => {
                    this.errorCallback(err);
                })
            } else {
                this.errorCallback({"message":"Enter feedback and complaints in above field."});
            }
        }
    },
    created() {
        const state = this.$store.state;
        if(state.authUser.email) {
            if(state.mandalName && state.villageName) {
                if(state.mandalName === config.aliasNames.mandalAliasName) {
                    if(state.mandalAliasName) {
                        this.getOccupationList();
                        this.getQuestionMetaData();
                        this.getAgeList();
                    } else {
                        this.errorCallback({"message":"You should enter mandal name manually, when mandal name is OTHER."});
                        router.push('/');
                    }
                } else {
                    this.getOccupationList();
                    this.getQuestionMetaData();
                    this.getAgeList();
                }
            } else {
                this.errorCallback({"message":"First select Mandal and village before survey"});
                router.push('/'); 
            }
        } else {
            router.push('/signin');
        }
    },
}
</script>

<style>
.full-width {
  width: 100%;
}
</style>


