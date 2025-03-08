import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { FaPlus } from "react-icons/fa";
import { SEARCH_CONTACTS_ROUTES } from "../../../../../../../utils/constants";
import { useAppStore } from '@/store'; // Import Zustand store

import apiClient from "../../../../../../../lib/api-client"; // Corrected path to apiClient

const NewDM = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const { userInfo } = useAppStore(); // Get logged-in user info

  // Fetch all users from backend (excluding logged-in user)
  useEffect(() => {
    if (!userInfo) {
      console.error("User is not logged in!");
      return;
    }

    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found!");
          return;
        }

        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchContacts: "all" }, // Send a default search term to fetch all contacts
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true, // Ensure credentials are sent
          }
        );

        if (response.status === 200) {
          console.log("Contacts fetched:", response.data.contacts);
          setContacts(response.data.contacts || []);
          setFilteredContacts(response.data.contacts || []);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [userInfo]);

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    // Include logged-in user in search results
    const allContacts = [...contacts, userInfo];

    setFilteredContacts(
      allContacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="p-1 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition text-xs">
            <FaPlus className="text-sm" />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1c1d25] p-3 rounded-lg shadow-lg w-[280px] text-white border border-gray-600">
            <Dialog.Title className="text-base font-semibold text-gray-200">
              New Direct Message
            </Dialog.Title>
            <Dialog.Description className="text-gray-400 text-xs mb-2">
              Start a new conversation with someone.
            </Dialog.Description>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-1 border rounded-md text-xs mb-2 bg-[#2a2b35] text-gray-300 border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Scrollable Contact List */}
            <ScrollArea.Root className="w-full h-32 overflow-hidden border rounded-md bg-[#2a2b35] border-gray-600">
              <ScrollArea.Viewport className="p-2">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact._id} // Use _id as the unique identifier

                      className="p-1 text-sm hover:bg-gray-600 rounded cursor-pointer"
                    >
                      {contact.name} ({contact.email})
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center p-3 text-xs">
                    No contacts found.
                  </div>
                )}
              </ScrollArea.Viewport>
            </ScrollArea.Root>

            {/* Close Button */}
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
              >
                Close
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default NewDM;
