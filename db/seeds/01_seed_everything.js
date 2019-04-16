const faker = require('faker');
const bcrypt = require('bcryptjs');
const db = require('../../config/db_config');

faker.seed(123);

knownPassword = bcrypt.hashSync('password', 8);

const randomItem = array => {
  return array[Math.floor(Math.random() * array.length)];
};

exports.seed = async (knex, Promise) => {
  const users = [];

  // create 100 known emails and passwords
  for (let i = 0; i < 100; i++) {
    users.push({
      firstname: faker.name.findName().firstName,
      lastname: faker.name.findName().lastName,
      email: `test${i}@test.com`,
      loan_range: faker.random.number({ min: 1, max: 100 }),
      address: [
        faker.address.streetAddress(),
        faker.address.streetSuffix(),
        faker.address.city(),
        faker.address.stateAbbr()
      ].join(' '),
      username: faker.internet.userName(),
      password: knownPassword
    });
  }

  // create 200 randoms
  for (let i = 0; i < 100; i++) {
    users.push({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      loan_range: faker.random.number({ min: 1, max: 100 }),
      address: [
        faker.address.streetAddress(),
        faker.address.streetSuffix(),
        faker.address.city(),
        faker.address.stateAbbr()
      ].join(' '),
      username: faker.internet.userName(),
      password: knownPassword
    });
  }

  await knex.batchInsert('users', users, 30 );
  const dbUsers = await knex('users');

  await knex('conditions').insert(
    ['new', 'used', 'ancient'].map(name => ({
      name,
      user_id: randomItem(dbUsers).id,
      image_url: faker.image.abstract(400, 400)
    }))
  );
  const dbConditions = await knex('conditions');

  await knex('categories').insert(
    [
      'treework',
      'lawncare',
      'automotive',
      'boating',
      'cycling',
      'construction',
      'hvac',
      'excavation',
      'aviation'
    ].map(name => ({
      name,
      user_id: randomItem(dbUsers).id,
      image_url: faker.image.abstract(400, 400)
    }))
  );
  const dbCategories = await knex('categories');

  const randomTools = [];

  const knownNames = [];
  const generateName = () => {
    let name = faker.commerce.productName();
    while(knownNames.includes(name)) {
      name = faker.commerce.productName();
    }
    knownNames.push(name);
    return name;
  }
  for(let i = 0; i < 1000; i++) {
    randomTools.push({
      name: generateName(),
      category_id: randomItem(dbCategories).id,
      condition_id: randomItem(dbConditions).id,
      image_url: faker.image.technics(400,400),
      user_id: randomItem(dbUsers).id
    });
  }
  await knex.batchInsert('tools', randomTools, 30 );
  const dbTools = await knex('tools');

  const randomFavorites = [];
  for(let i = 0; i < 500; i++) {
    randomFavorites.push({
      user_id: randomItem(dbUsers).id,
      target_user_id: randomItem(dbUsers).id
    });
  }
  await knex.batchInsert('favorites', randomFavorites, 30 );

  const randomReviews = [];
  for(let i = 0; i < 1000; i++) {
    randomReviews.push({
      user_id: randomItem(dbUsers).id,
      tool_id: randomItem(dbTools).id,
      score: faker.random.number({ min: 1, max: 5 }),
      message: faker.hacker.phrase()
    });
  }
  await knex.batchInsert('reviews', randomReviews, 30 );

  const randomLoanRequests = [];
  const generateLoanRequest = () => {
    return {
      user_id: randomItem(dbUsers).id,
      loaner_id: randomItem(dbUsers).id,
      message: faker.company.bs(),
      tool_id: randomItem(dbTools).id,
      has_been_seen: randomItem([true, false]),
      status: randomItem(['pending', 'active', 'complete'])
    };
  };

  for(let i = 0; i < 1000; i++) {
    let possibleLR = generateLoanRequest();

    // avoid loaners borrowing from themselves
    while(possibleLR.loaner_id === possibleLR.userId) {
      possibleLR = generateLoanRequest();
    }

    randomLoanRequests.push(possibleLR);
  }
  await knex.batchInsert('loan_requests', randomLoanRequests, 30 );
};
