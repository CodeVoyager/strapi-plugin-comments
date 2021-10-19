import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { isEmpty, isArray, first } from 'lodash';
import CardWrapper from './CardWrapper';
import CardItem from './CardItem';
import CardLevelCounter from './CardLevelCounter';
import CardLevelCounterLink from './CardLevelCounterLink';
import ItemFooter from '../ItemFooter';
import ItemModeration from '../ItemModeration';
import ItemHeader from '../ItemHeader';
import AbuseReportsPopUp from '../AbuseReportsPopUp';
import pluginId from '../../pluginId';
import { APPROVAL_STATUS } from "../../utils/constants";

const ItemDetails = ({
  id,
  content,
  active,
  clickable,
  root,
  threadsCount,
  authorName,
  authorUser,
  created_at,
  createdAt,
  updated_at,
  updatedAt,
  related,
  reports,
  blocked,
  blockedThread,
  removed,
  onClick,
  onBlockClick,
  onBlockThreadClick,
  onAbuseReportResolve,
  onApproveCommentClick,
  onRejectCommentClick,
  approvalStatus,
}) => {
  const [showPopUp, setPopUpVisibility] = useState(false);

  const onPopUpOpen = e => {
    e.preventDefault();
    e.stopPropagation();
    setPopUpVisibility(true);
  };

  const onPopUpClose = e => {
    e.preventDefault();
    e.stopPropagation();
    setPopUpVisibility(false);
  };

  const onAbuseReportResolveClick = (e, reportId) => {
    e.preventDefault();
    e.stopPropagation();
    onAbuseReportResolve(reportId, id);
  };
  const hasThreads = (threadsCount !== undefined) && (threadsCount > 0);
  const isAbuseReported = !isEmpty(reports);
  const isPending = approvalStatus === APPROVAL_STATUS.PENDING;
  const isItemHeaderDisplayed = blocked || blockedThread || removed || isAbuseReported || isPending;
  const footerProps = {
    authorName,
    authorUser,
    related: isArray(related) ? first(related) : related,
    created_at: created_at || createdAt,
    updated_at: updated_at || updatedAt,
    isDetailedView: true,
  };
  const headerProps = {
    active,
    blocked,
    blockedThread,
    isRemoved: removed,
    abuseReports: reports || [],
    isAbuseReported: !isEmpty(reports),
    isDetailedView: true,
    onReportsClick: onPopUpOpen,
    approvalStatus,
  };
  const moderationProps = {
    id,
    blocked,
    blockedThread,
    onBlockClick,
    onBlockThreadClick,
    onApproveCommentClick,
    onRejectCommentClick,
    approvalStatus,
  };
  const reportsPopUpProps = {
    blocked,
    blockedThread,
    reports,
    comment: {
      id, content, authorName, authorUser, created_at, updated_at,
    },
    onBlockClick,
    onBlockThreadClick,
    onAbuseReportResolveClick,
    isOpen: showPopUp,
    onClose: onPopUpClose,
  };

  return (
    <CardWrapper root={root} active={active}>
      <CardItem
        onClick={e => (hasThreads || root) && clickable && !active && onClick(e)}
        clickable={clickable}
        root={root}
        active={active}>
        {isItemHeaderDisplayed && (<ItemHeader { ...headerProps } />) }
        <p>{content}</p>
        <ItemFooter {...footerProps} />
      </CardItem>
      {hasThreads && (<CardLevelCounter>
          <FormattedMessage id={`${pluginId}.list.item.threads.count`} values={{ count: threadsCount }}/>
          <CardLevelCounterLink onClick={onClick}>
            <FormattedMessage id={`${pluginId}.list.item.threads.drilldown`} />
            <FontAwesomeIcon icon={faArrowRight} />
          </CardLevelCounterLink>
        </CardLevelCounter>
      )}
      {active && !removed && (<ItemModeration { ...moderationProps } />)}
      {(!isEmpty(reports) && active) && (
        <AbuseReportsPopUp
          {...reportsPopUpProps}
        />
      )}
    </CardWrapper>
  );
};

ItemDetails.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  content: PropTypes.string.isRequired,
  active: PropTypes.bool,
  clickable: PropTypes.bool,
  root: PropTypes.bool,
  threadsCount: PropTypes.number,
  authorName: PropTypes.string,
  authorUser: PropTypes.object,
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string,
  related: PropTypes.array,
  reports: PropTypes.array,
  blocked: PropTypes.bool,
  blockedThread: PropTypes.bool,
  onClick: PropTypes.func,
  onBlockClick: PropTypes.func,
  onBlockThreadClick: PropTypes.func,
  onAbuseReportResolve: PropTypes.func,
  approvalStatus: PropTypes.oneOf([
    APPROVAL_STATUS.APPROVED,
    APPROVAL_STATUS.PENDING,
    APPROVAL_STATUS
  ]),
  onApproveCommentClick: PropTypes.func,
  onRejectCommentClick: PropTypes.func,
};

export default ItemDetails;
