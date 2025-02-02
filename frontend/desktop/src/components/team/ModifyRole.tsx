import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { useState } from 'react';
import { ROLE_LIST, UserRole } from '@/types/team';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { modifyRoleRequest } from '@/api/namespace';
import { useCustomToast } from '@/hooks/useCustomToast';
import { ApiResp } from '@/types';
export default function ModifyRole({
  ns_uid,
  k8s_username,
  currentRole,
  userId,
  roles,
  ...props
}: Parameters<typeof Button>[0] & {
  ns_uid: string;
  userId: string;
  currentRole: UserRole;
  roles: UserRole[];
  k8s_username: string;
}) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [role, setRole] = useState(currentRole);
  const queryClient = useQueryClient();
  const { toast } = useCustomToast({ status: 'error' });
  const mutation = useMutation({
    mutationFn: modifyRoleRequest,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['ns-detail'], exact: false });
      onClose();
    },
    onError(error) {
      toast({ title: (error as ApiResp).message });
    }
  });
  const submit = () => {
    mutation.mutate({
      ns_uid,
      tK8s_username: k8s_username,
      tRole: role,
      tUserId: userId
    });
  };
  return (
    <>
      {
        <Button
          onClick={onOpen}
          fontSize={'12px'}
          fontWeight={'500'}
          variant={'unstyled'}
          {...(props as Parameters<typeof Button>[0])}
        >
          {ROLE_LIST[currentRole]}
        </Button>
      }
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          borderRadius={'4px'}
          maxW={'380px'}
          bgColor={'#FFF'}
          backdropFilter="blur(150px)"
          p="24px"
        >
          <ModalCloseButton right={'24px'} top="24px" p="0" />
          <ModalHeader p="0">modify member</ModalHeader>
          {mutation.isLoading ? (
            <Spinner mx="auto" />
          ) : (
            <ModalBody h="100%" w="100%" p="0" mt="22px">
              <Menu>
                <MenuButton
                  as={Button}
                  variant={'unstyled'}
                  borderRadius="2px"
                  border="1px solid #DEE0E2"
                  bgColor="#FBFBFC"
                  w="100%"
                  mt="24px"
                  px="12px"
                >
                  <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Text>{ROLE_LIST[role]}</Text>
                    <Image
                      src="/images/material-symbols_expand-more-rounded.svg"
                      w="16px"
                      h="16px"
                      transform={'rotate(90deg)'}
                    />
                  </Flex>
                </MenuButton>
                <MenuList borderRadius={'2px'}>
                  {roles.map((_role, idx) => (
                    <MenuItem
                      w="330px"
                      onClick={(e) => {
                        e.preventDefault();
                        setRole(_role);
                      }}
                      key={idx}
                    >
                      {ROLE_LIST[_role]}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Button
                w="100%"
                variant={'unstyled'}
                bg="#24282C"
                borderRadius={'4px'}
                color="#fff"
                py="6px"
                px="12px"
                mt="24px"
                _hover={{
                  opacity: '0.8'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                confirm
              </Button>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
