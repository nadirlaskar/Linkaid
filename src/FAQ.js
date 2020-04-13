
import React, { useState, useEffect } from "react";
import FaqList from "./ExpansionList";
import Typography from "@material-ui/core/Typography";
import {hostname} from './config';
export default ({}) => {
    const [faqs, setFaq] = useState([]);
    useEffect(() => {
      fetch(`${hostname}/faq`)
        .then(res => res.json())
        .then(res => setFaq(res));
    }, []);
    const faqList = faqs.map(faq => {
      return {
        title: faq.FAQ,
        description: faq.Anwer,
        url: faq.URL
      };
    });
    return (
      <div class="answer faq">
        <>
          <div class="faq-title">
            <Typography
              variant="subtitle1"
              component="h2"
              gutterBottom={true}
              align={"center"}
              color="primary"
            >
              Frequently Asked Question
            </Typography>
  
            <Typography
              style={{
                color: "#7b7b7b"
              }}
              variant="caption"
              component="div"
              gutterBottom={true}
              align={"center"}
            >
              {faqList.length == 0
                ? "Loading..."
                : `Found ${faqList.length} frequently asked questions`}
            </Typography>
          </div>
          <FaqList list={faqList} />
        </>
      </div>
    );
  };