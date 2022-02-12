//----------------------------------------------------------------------------//
//-- Building Employee Cards


//------------------------------------------------------------------------------
//-- Class

class Templates {
    constructor(){
      this.name = "template";
    };


    set_ArticleHeader = payload => {

      // _get_EmployeeCards(teamData_Dict)
    
    
      return`<div class="ArticleHeaderWrapper">
        <h1><span class="ArticleHeader">${payload.title}</span></h1>
        <img alt="${payload.resources.alt}" src="${payload.resources.url}" /></div>

        <div class="ArticleHeaderSummary">This content is still under construction! We appreciate your patience as we work to provide your business with the learning materials it needs to be successful. Finally, your visit to this page will not go unnoticed. We are closely monitoring our most popular pages under construction to guide us in what articles we need to create next. In the mean time, if you need immediate assistance, don&#39;t hesitate to contact our <a href="https://www.posnation.com/contact-us">24 / 7 support team</a>.</div>
    `};
    
      set_ArticleContent = payload => {

        let stepIndex_HTML = this.build_Steps_Index(payload);
        let steps_HTML =  this.build_Steps(payload);
      
        return`
        <h2><a id="Table-of-Contents" style="text-decoration: none;" target="_blank"><span class="ArticleDivider">TABLE OF CONTENTS</span></a></h2>
        
        <table border="0" class="ArticleTableWrapper" style="width: 100%;">
          <tbody>
            <tr class="ArticleTableHeader">
              <td class="ArticleTableCell" colspan="1" rowspan="1"><span>STEPS</span></td>
              <td class="ArticleTableCell" colspan="1" rowspan="1"><span>CONTENT</span></td>
            </tr>
            ${stepIndex_HTML}
            <tr class="ArticleTableFooter">
              <td colspan="1" rowspan="1">&nbsp;</td>
              <td colspan="1" rowspan="1">&nbsp;</td>
            </tr>
        </tbody>
      </table>
      
      <h2><a id="Steps-to-Complete" style="text-decoration: none;" target="_blank"><span class="ArticleDivider">STEPS TO COMPLETE</span></a></h2>
      ${steps_HTML}
      `};

      Set_ArticleFAQ = payload => {

      let questionAnswerHTML_ALL = this.build_FAQS(payload.questions);


            
      
        return`<h2><a id="FAQ" style="text-decoration: none;" target="_blank"></a><span class="ArticleDivider">FREQUENTLY ASKED QUESTIONS</span></h2>

        ${questionAnswerHTML_ALL}

        <hr />

        <div class="SupportCTAWrapper">
        <h2><span class="SupportCTAHeader">Need More Help?</span></h2>

        <p><span class="SupportCTABody">Let the&nbsp;<strong>experts&nbsp;</strong>handle it from here! Our&nbsp;<strong>24/7 support team</strong>&nbsp;is standing by ready to assist you with all of your troubleshooting and questions.</span></p>

        <p><span class="SupportCTACloser">We offer month-to-month service with no long-term contracts. Sign up here and get assistance today!</span></p>

        <div class="ArticleFAQLinkWrapper"><a href="https://www.posnation.com/support?utm_source=knowledgebase&utm_medium=web&utm_campaign=Support#monthly-support" style="text-decoration: none;" target="_blank"><span class="ArticleFAQLink">24 / 7 Support Signup</span></a></div>
        </div>

        <div class="ArticleDivider">&nbsp;</div>
      `
      };


    //-- Build out the Index Content
    build_Steps_Index(payload){

      let stepIndex_HTML = null;

      
      for(let step in payload.steps){
        
        let string = payload.steps[step].str
        let href = payload.steps[step].href
        let name = payload.steps[step].name

        //-- Building step for index
        let stepRaw = `<tr class="ArticleTableBody${step}">`
          +`<td class="ArticleTableCell" colspan="1" rowspan="1"><a href="#${href}">${string}</a></td>`
          +`<td class="ArticleTableCell" colspan="1" rowspan="1">${name}</td>`
          +`</tr>`
          +``
          
          //-- adding all steps together
          stepIndex_HTML = stepIndex_HTML + stepRaw
        
      }

      return stepIndex_HTML;
    };

    //-- Build out actual steps
    build_Steps(payload){

      let stepsHTML_ALL = null;

      //-- Loop through each step
      for(let step in payload.steps){
        
        //-- step specific
        let _step = payload.steps[step]
        let string = _step.str
        let href = _step.href
        let name = _step.name
        let summary = _step.summary;

        
        //-- giphy specific
        let resources = _step.resources
        let giphy_alt = resources.giphy.alt;
        let giphy_url = resources.giphy.src;

        //-- Micro-steps
        let microSteps = _step.microSteps;
        let microStep_HTML = this.build_MicroSteps(microSteps);

        //-- Building step for index
        let stepRaw = `<h3><span class="StepTitle"><a id="${href}" name="${name}" style="text-decoration: none;"><b>${string}: ${name}</b></a></span></h3>
            <div class="ArticleContentTable">
            <div class="ArticleContentTableImage" colspan="1" rowspan="1"><img alt="${giphy_alt}" class="ArticleGIF" src="${giphy_url}" />
            </div>
              <div class="ArticleContentTableText" colspan="1" rowspan="1">
                ${summary}
                <ul class="MicroStepListWrapper">
                  <li><span class="MicroStepListBody">${microStep_HTML}</span></li>
                </ul>
              </div>
            </div>
            
            <hr />`
          
          //-- adding all steps together
          stepsHTML_ALL = stepsHTML_ALL + stepRaw
      }

      return stepsHTML_ALL;
    };


    //-- Building micro-steps within step
    build_MicroSteps(microSteps){
      let microStep_HTML = `<ul class="MicroStepListWrapper">`;

      //-- build the micro-step and merge to raw
      for(let step in microSteps){
        let microStep_Raw = `<li><span class="MicroStepListBody">${microSteps[step]}</span></li>`

        //-- building micro-steps
        microStep_HTML = microStep_HTML + microStep_Raw;
      };
      microStep_HTML = microStep_HTML +`</ul>`
      //-- return it
      return microStep_HTML;
    };

    //-- Building out FAQ Question and Answers
    build_FAQS(faqs){
      let questionAnswerHTML_ALL = null;
      
      // console.log(faqs)

      for(let faq in faqs) {
        
        let _faq = faqs[faq]
        let question = _faq.question;
        let answer = _faq.answer;
        let link = _faq.link;

        //-- Build content
        let faqRAW = `<div class="FAQWrapper">
          <div class="FAQHoverWrapper">            
            <div class="QuestionWrapper QuestionBorder tri-left left-top"><span class="QuestionBody">${question}</span></div>
          </div>
        
          <div class="FAQHoverWrapper">
            <div class="AnswerWrapper AnswerBorder tri-right right-top"><span class="AnswerBody">${answer}</span>
        
              <div class="ArticleLinkWrapper"><a style="text-decoration: none; color: #000000;" target="_blank"> <span class="ArticleLink">${link}</span> </a></div>
            </div>
          </div>
        </div>`

        questionAnswerHTML_ALL = questionAnswerHTML_ALL + faqRAW;
      
      };

      return questionAnswerHTML_ALL;
    };
    
};


const template = new Templates();

module.exports = template;