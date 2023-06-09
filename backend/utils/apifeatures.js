class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};

    console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    console.log(queryCopy);
    // Removing some fields for category
    const removeFields = ["keyword", "page", "limit", "type"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter for Price and Rating
    console.log(queryCopy);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    console.log(queryStr);
    // this.query = this.query.find(queryCopy);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }

  sort() {
    const type = this.queryStr.type;

    const sort = type === "desc" ? -1 : type === "asc" && 1;
    const sortObject = sort && { price: sort };
    console.log("sort", { sort });

    this.query = this.query.sort(sortObject);

    return this;
  }
}

module.exports = ApiFeatures;
