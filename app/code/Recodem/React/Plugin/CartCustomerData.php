<?php
/*
 * Copyright (c) 2023. Recodem, Inc. All rights reserved.
 *
 */
declare(strict_types=1);
namespace Recodem\React\Plugin;
use Closure;
use Magento\Checkout\CustomerData\Cart;
use Magento\Checkout\Model\Session;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Quote\Model\QuoteIdToMaskedQuoteIdInterface;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Integration\Api\UserTokenIssuerInterface;
use Magento\Integration\Model\CustomUserContext;
use Magento\Authorization\Model\UserContextInterface;
use Magento\Integration\Api\Data\UserTokenParametersInterfaceFactory;
class CartCustomerData
{
    /**
     * @var Session
     */
    protected Session $checkoutSession;
    /**
     * @var QuoteIdToMaskedQuoteIdInterface
     */
    private QuoteIdToMaskedQuoteIdInterface $quoteIdToMaskedQuoteId;
    /**
     * @var CustomerSession
     */
    protected CustomerSession $customerSession;
    /**
     * @var UserTokenIssuerInterface
     */
    protected UserTokenIssuerInterface $userTokenIssuerInterface;
    /**
     * @var UserTokenParametersInterfaceFactory
     */
    protected UserTokenParametersInterfaceFactory $tokenParametersInterfaceFactory;

    /**
     * @param Session $checkoutSession
     * @param QuoteIdToMaskedQuoteIdInterface $quoteIdToMaskedQuoteId
     * @param CustomerSession $customerSession
     * @param UserTokenIssuerInterface $userTokenIssuerInterface
     * @param UserTokenParametersInterfaceFactory $tokenParametersInterfaceFactory
     */
    public function __construct(
        Session $checkoutSession,
        QuoteIdToMaskedQuoteIdInterface $quoteIdToMaskedQuoteId,
        CustomerSession $customerSession,
        UserTokenIssuerInterface $userTokenIssuerInterface,
        UserTokenParametersInterfaceFactory $tokenParametersInterfaceFactory

    )
    {
        $this->checkoutSession = $checkoutSession;
        $this->quoteIdToMaskedQuoteId = $quoteIdToMaskedQuoteId;
        $this->customerSession = $customerSession;
        $this->userTokenIssuerInterface = $userTokenIssuerInterface;
        $this->tokenParametersInterfaceFactory = $tokenParametersInterfaceFactory;
    }

    /**
     * @param Cart $subject
     * @param $result
     * @return array
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function afterGetSectionData(
        Cart $subject,
       $result
    )
    {
        $id = (int)$this->checkoutSession->getQuote()->getId();
        $storeCode = $this->checkoutSession->getQuote()->getStore()->getCode();
        if ($this->customerSession->isLoggedIn()) {
            $customerId = (int)$this->customerSession->getCustomer()->getId();
            $isCookieAvailable = $this->customerSession->getToken() ?? false;
            if(!$isCookieAvailable)
            {
                $token = $this->createCustomerToken($customerId);
                if($token)
                {
                    $this->customerSession->setToken($token);
                    $result['quote_id'] = $this->createCustomerToken($customerId);
                }
            }else{
                $result['quote_id'] = $isCookieAvailable;
            }
        }else{
            $result['quote_id'] = $this->getQuoteMaskId($id);
        }
        $result['store_code'] = $storeCode;
        return $result;
    }

    /**
     * @param $quoteId
     * @return string
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getQuoteMaskId($quoteId): string
    {
        $maskedId = null;
        $maskedId = $this->quoteIdToMaskedQuoteId->execute($quoteId);
        return $maskedId;
    }

    /**
     * @param $customerId
     * @return string
     */
    private function createCustomerToken($customerId): string
    {
        return $this->userTokenIssuerInterface->create(
            new CustomUserContext((int) $customerId, UserContextInterface::USER_TYPE_CUSTOMER),
            $this->tokenParametersInterfaceFactory->create()
        );
    }

}

