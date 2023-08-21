class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // 1. Filtering
    let queryObj = { ...this.queryStr }; // { difficulty : easy}

    // 2. Exclude Fields
    var excludeFields = ["sort", "fields", "limit", "page"];

    excludeFields.forEach((el) => delete queryObj[el]);

    console.log(queryObj);

    var queryObjStr = JSON.stringify(queryObj);

    // 3. Advanced Filtering
    queryObjStr = queryObjStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (item) => `$${item}`
    );

    this.query = this.query.find(JSON.parse(queryObjStr));

    return this;
  }

  sort() {
    // 4. Sorting
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limit() {
    // 5. Limiting the fields
    if (this.queryStr.fields) {
      this.query = this.query.select(this.queryStr.fields.split(",").join(" "));
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    // 6. Pagination
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
