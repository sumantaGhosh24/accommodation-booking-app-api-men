import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {faker} from "@faker-js/faker";

import User from "./models/userModel";
import Category from "./models/categoryModel";
import Hotel from "./models/hotelModel";
import Rating from "./models/ratingModel";
import Booking from "./models/bookingModel";
import connectDB from "./lib/connectDB";

dotenv.config();

connectDB();

const seedDB = async () => {
  try {
    console.log("Database seeding started...");

    console.log("Creating admin...");
    const admin = new User({
      email: faker.internet
        .email({firstName: "test", lastName: "admin"})
        .toLowerCase(),
      mobileNumber: faker.phone.number({style: "international"}),
      password: await bcrypt.hash("test@admin", 10),
      firstName: "test",
      lastName: "admin",
      username: faker.internet.username({firstName: "test", lastName: "admin"}),
      image: {
        public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
        url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
      },
      dob: faker.date
        .past({years: 30, refDate: "2000-01-01"})
        .toISOString()
        .split("T")[0],
      gender: faker.person.gender(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
      addressline: faker.location.streetAddress(),
      status: "active",
      role: "admin",
    });
    await admin.save();
    console.log("Created admin.");

    console.log("Seeding users...");
    const users = [];
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const user = new User({
        email: faker.internet.email({firstName, lastName}).toLowerCase(),
        mobileNumber: faker.phone.number({style: "international"}),
        password: await bcrypt.hash(firstName, 10),
        firstName: firstName,
        lastName: lastName,
        username: faker.internet.username({firstName, lastName}),
        image: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        },
        dob: faker.date
          .past({years: 30, refDate: "2000-01-01"})
          .toISOString()
          .split("T")[0],
        gender: faker.person.gender(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zip: faker.location.zipCode(),
        addressline: faker.location.streetAddress(),
        status: "active",
        role: "user",
      });
      users.push(await user.save());
    }
    console.log(`Seeded ${users.length} users.`);

    console.log("Seeding categories...");
    const categories = [];
    const categoryNames = [
      "Luxury",
      "Budget",
      "Boutique",
      "Resort",
      "Business",
      "Family-Friendly",
      "Pet-Friendly",
      "Eco-Friendly",
      "Historic",
      "Beachfront",
    ];
    for (let i = 0; i < 10; i++) {
      const category = new Category({
        name: categoryNames[i] || faker.lorem.word({length: {min: 5, max: 10}}),
        image: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        },
      });
      categories.push(await category.save());
    }
    console.log(`Seeded ${categories.length} categories.`);

    console.log("Seeding hotels...");
    const hotels = [];
    for (let i = 0; i < 100; i++) {
      const randomCategory = faker.helpers.arrayElement(categories);
      const hotel = new Hotel({
        owner: admin._id,
        title: faker.company.name() + " Hotel",
        description: faker.lorem.paragraph(),
        content: faker.lorem.paragraphs(3),
        images: Array.from({length: faker.number.int({min: 1, max: 5})}).map(
          () => ({
            public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
            url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
          })
        ),
        category: randomCategory._id,
        price: faker.number.int({min: 50, max: 1000}),
        booked: faker.datatype.boolean(),
        country: faker.location.country(),
        city: faker.location.city(),
        zip: faker.location.zipCode(),
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        verified: faker.datatype.boolean(),
      });
      hotels.push(await hotel.save());
    }
    console.log(`Seeded ${hotels.length} hotels.`);

    console.log("Seeding ratings...");
    const ratings = [];
    for (let i = 0; i < 300; i++) {
      const randomHotel = faker.helpers.arrayElement(hotels);
      const randomUser = faker.helpers.arrayElement(users);
      const rating = new Rating({
        hotel: randomHotel._id,
        user: randomUser._id,
        comment: faker.lorem.sentence(),
        rating: faker.number.int({min: 1, max: 5}),
      });
      ratings.push(await rating.save());
    }
    console.log(`Seeded ${ratings.length} ratings.`);

    console.log("Seeding bookings...");
    const bookings = [];
    for (let i = 0; i < 150; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const randomHotel = faker.helpers.arrayElement(hotels);
      const startDate = faker.date
        .future({years: 1})
        .toISOString()
        .split("T")[0];
      const endDate = faker.date
        .soon({days: faker.number.int({min: 1, max: 10}), refDate: startDate})
        .toISOString()
        .split("T")[0];

      const booking = new Booking({
        user: randomUser._id,
        hotel: randomHotel._id,
        paymentResult: {
          id: faker.string.uuid(),
          status: faker.helpers.arrayElement(["paid", "pending", "failed"]),
          razorpay_order_id: faker.string.uuid(),
          razorpay_payment_id: faker.string.uuid(),
          razorpay_signature: faker.string.alphanumeric(32),
        },
        price: randomHotel.price * faker.number.int({min: 1, max: 5}),
        startDate: startDate,
        endDate: endDate,
        status: faker.helpers.arrayElement([
          "confirmed",
          "pending",
          "cancelled",
        ]),
      });
      bookings.push(await booking.save());
    }
    console.log(`Seeded ${bookings.length} bookings.`);

    console.log("Database seeding complete!");
  } catch (error) {
    console.log(error);
  }
};

seedDB();
