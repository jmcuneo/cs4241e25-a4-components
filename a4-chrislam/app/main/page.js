'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function MainPage() {

    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    /*
      assignDrinkPersona divides up the alphabet in 4 quadrants. Based on the form entry's first name, it gets assigned a quadrant, and it then becomes their persona.
     */
    function assignDrinkPersona(firstName) {
        const firstChar = firstName?.[0].toUpperCase();
        let persona = "";

        if (firstChar >= 'A' && firstChar <= 'F') persona = "Strawberry Matcha";
        else if (firstChar >= 'G' && firstChar <= 'L') persona = "Brown Sugar Cold Brew";
        else if (firstChar >= 'M' && firstChar <= 'R') persona = "Blueberry Matcha";
        else persona = "Chai Latte";
        return persona;
    }

    //handling waitlist entry form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        //waitlist entry data
        const waitlistEntryData = new FormData(e.target);
        const data = {
            firstName: waitlistEntryData.get('firstName'),
            lastName: waitlistEntryData.get('lastName'),
            email: waitlistEntryData.get('email'),
            luckyNumber: waitlistEntryData.get('luckyNumber'),
            phoneNumber: waitlistEntryData.get('phoneNumber') || '' //bc it is optional
        };

        try {
            const response = await fetch('/waitlist_entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                // Show success message with drink persona
                const persona = assignDrinkPersona(data.firstName);
                alert(`Thank you! You've been added to the waitlist. As part of our personas for a free drink, you are a ${persona}!!! Please keep a lookout for our messages!`);

                // Reset form
                e.target.reset();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || 'Failed to submit form'}`);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('An error occurred while submitting the form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    //logout
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/logout');
            if (response.ok || response.redirected) {
                router.push('/');
            }
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/');
        }
    };

    return (
        <div className="bg-white w-1/2 m-auto pt-10">
            {/* Header */}
            <div className="flex items-center m-auto gap-4 justify-between">
                <div className="flex gap-4 items-center">
                    <img id="northstar" src="/northstar.jpg" alt="northstar" className="w-12 h-12" />
                    <h1 className="font-bold text-2xl ">Northstar Cafe</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <form action="/logout">
                        <button onClick={handleLogout}>
                            <span className="hover:underline">Logout</span>
                        </button>
                    </form>
                    <a
                        href="/tables"
                        className="text-white bg-black p-2 rounded-md hover:bg-[#161513] transition"
                    >
                        Admin Tables
                    </a>
                </div>
            </div>

            <br />

            {/* Welcome Message */}
            <p className="text-[#5E718E]">
                Welcome to the Northstar Cafe Waitlist! We are currently in the process of making our menu,
                and if you are interested in seeing what we have to offer, please fill out this form and we
                will email you when it is released. Thank you and we hope to see you soon!
                <br />
                <br />
                ~ The Northstar Team
            </p>

            <hr />

            {/* Form */}
            <form id="ourForm" className="flex flex-col mb-20" onSubmit={handleSubmit}>
                <br />
                <label htmlFor="firstName" className="text-md mb-2 text-[#5E718E]">
                    First Name<span className="text-[#ef4444]"> *</span>
                </label>
                <input
                    required
                    type="text"
                    id="firstName"
                    placeholder="ex. Jane"
                    className="w-full p-4 border border-[#ECEBEB] rounded bg-[#FCFCFC] focus:outline-none focus:border-[#5E718E]"/>
                <br />

                <label htmlFor="lastName" className="text-md mb-2 text-[#5E718E]">
                    Last Name<span className="text-[#ef4444]"> *</span>
                </label>
                <input
                    required
                    type="text"
                    id="lastName"
                    placeholder="ex. Doe"
                    className="w-full p-4 border border-[#ECEBEB] rounded bg-[#FCFCFC] focus:outline-none focus:border-[#5E718E]"/>
                <br />

                <label htmlFor="email" className="text-md mb-2 text-[#5E718E]">
                    Email<span className="text-[#ef4444]"> *</span>
                </label>
                <input
                    required
                    type="text"
                    id="email"
                    placeholder="ex. janedoe@gmail.com"
                    className="w-full p-4 border border-[#ECEBEB] rounded bg-[#FCFCFC] focus:outline-none focus:border-[#5E718E]"/>
                <br />

                <label htmlFor="phoneNumber" className="text-md mb-2 text-[#5E718E]">
                    Phone Number (optional)
                </label>
                <input
                    type="text"
                    id="phoneNumber"
                    placeholder="ex. 123-456-7890"
                    className="w-full p-4 border border-[#ECEBEB] rounded bg-[#FCFCFC] focus:outline-none focus:border-[#5E718E]"/>
                <br />

                <label htmlFor="luckyNumber" className="text-md mb-2 text-[#5E718E]">
                    What's your lucky number?<span className="text-[#ef4444]"> *</span>
                </label>
                <input
                    required
                    type="number"
                    id="luckyNumber"
                    placeholder="ex. 7"
                    className="w-full p-4 border border-[#ECEBEB] rounded bg-[#FCFCFC] focus:outline-none focus:border-[#5E718E]"/>
                <br />

                <button
                    id="submitButton"
                    type="submit"
                    className="text-white bg-black p-3 rounded-md hover:bg-[#161513] transition"
                >
                    Submit Form
                </button>
            </form>

        </div>
    );
}
