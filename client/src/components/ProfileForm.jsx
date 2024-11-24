import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Flex,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const ProfileForm = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const toast = useToast();
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload logic here
      toast({
        title: "Success",
        description: "Profile picture has been selected",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    // Reset file input so the same file can be selected again if needed
    setFileInputKey(Date.now());
  };

  const handleUploadButtonClick = () => {
    document.getElementById("profilePicInput").click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", sm: "80%", md: "60%", lg: "50%" }}
        maxH={"90vh"}
        overflowY={"auto"}
      >
        <ModalHeader>Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "flex-start" }}
            gap={4}
          >
            <Flex
              direction="column"
              align="center"
              mb={{ base: 4, md: 0 }}
              mr={{ base: 0, md: 4 }}
            >
              {/* Profile Picture */}
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.profilePicture || "/default-avatar.png"} // Default image fallback
                alt={`${user.name}'s profile picture`}
                border="2px solid"
                borderColor="purple.200"
                mb={2}
              />
              <Button type="button" colorScheme="blue" onClick={handleUploadButtonClick}>
                Upload Profile Picture
              </Button>
              <Input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                display="none"
                key={fileInputKey}
              />
            </Flex>

            {/* User Details */}
            <Box flex="1">
              <Box
                bg="purple.100"
                p="4"
                borderRadius="md"
                fontWeight="bold"
                fontSize="xl"
                textAlign="center"
                mb={4}
              >
                Welcome, {user.name}
              </Box>
              <Box bg="blue.100" p="4" borderRadius="md" mb={4}>
                This is your Username: {user.name} <br />
                This is your Email: {user.email}
              </Box>
              <Box bg="green.100" p="4" borderRadius="md" mb={4}>
                Account activity:
                <br />
                <span style={{ fontWeight: "bold" }}>Joined at: </span>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                <br />
                <span style={{ fontWeight: "bold" }}>Last login: </span>
                {formatDate(user.lastLogin)}
              </Box>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm;
