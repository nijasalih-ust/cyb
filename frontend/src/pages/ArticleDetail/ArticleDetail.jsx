import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mitreData } from "../../data/mitreData";
import "./ArticleDetail.css";

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = mitreData.find((item) => item.id === parseInt(id));

  if (!article) {
    return (
      <div className="article-detail">
        <h2>Article not found</h2>
        <button onClick={() => navigate("/library")}>Back to Library</button>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <h2>{article.title}</h2>
      <p>{article.details}</p>
      <button onClick={() => navigate("/library")}>Back to Library</button>
    </div>
  );
}

export default ArticleDetail;
