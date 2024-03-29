import { ChatBubble as ChatBubbleIcon } from '@mui/icons-material';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import CommentDialog from './CommentDialog';
import CustomSkeleton from './CustomSkeleton';
import TablePaginationActions from './TablePaginationActions';

import axios from 'axios';
import clsx from 'clsx';
import { ROLE_ID } from 'src/types/db';
import { CommentDataProps, SubmissionDataProps } from 'src/types/submission';
import useSWR from 'swr';

const twStyles = {
  groupBlurOnHover: 'group-hover:blur-[1px]',
};

const URL = 'https://antiscam-api.paranodes.io';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

const OverviewTable = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const handleGoToForm = (baseUrl: string, id: number) => {
    router.push(
      {
        pathname: baseUrl,
        query: {
          submission_id: id,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [submissions, setSubmissions] = useState<SubmissionDataProps[] | null>(null);

  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [comments, setComments] = useState<CommentDataProps[]>([]);
  const [referencedUrl, setReferencedUrl] = useState('');

  const { data, isLoading } = useSWR(`${URL}/find`, fetcher);

  useEffect(() => {
    if (data) {
      const { data: responseData } = data;
      if (responseData && responseData.length > 0) {
        setSubmissions(responseData);
      }
    }
  }, [data]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && submissions ? Math.max(0, (1 + page) * rowsPerPage - submissions.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCommentDialog = (comments: CommentDataProps[], referencedUrl: string) => {
    setOpenCommentDialog(true);
    setComments(comments);
    setReferencedUrl(referencedUrl);
  };

  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
  };

  const isValidHttpUrl = (urlString: string) => {
    try {
      //@ts-ignore
      const url = new URL(urlString);
      return url;
    } catch (_) {
      const protocol = 'https://';
      return protocol.concat(urlString);
    }
  };

  const extractDomainName = (urlString: string) => {
    try {
      //@ts-ignore
      const url = new URL(urlString);
      const { hostname } = url;
      return hostname;
    } catch (_) {
      return urlString;
    }
  };

  const isUser = Boolean(session?.user.user_roles);

  if (isLoading) return <CustomSkeleton />;

  return (
    <>
      <TableContainer sx={{ width: 'max-content' }} component={Paper}>
        <Table sx={{ minWidth: 650, width: '100%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Implementer</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">GitHub Report</TableCell>
              <TableCell align="center">Domain</TableCell>
              <TableCell align="center">UrlScan Link</TableCell>
              <TableCell align="center">Taken Down</TableCell>
              <TableCell align="center">Confirmed</TableCell>
              <TableCell align="center">Eligibility</TableCell>
              <TableCell align="center">Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions && submissions.length
              ? (rowsPerPage > 0
                  ? submissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : submissions
                ).map(({ comments, url_data, user_data }, i) => (
                  <TableRow
                    key={`${url_data.submitted_by}-${i}`}
                    className="group"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="implementer-id"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {user_data.identifier}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="date"
                      align="left"
                    >
                      {new Date(url_data.createdAt ?? '').toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="github-pr"
                      align="left"
                    >
                      {url_data.pull_request_id !== null ? (
                        <a
                          href={`https://github.com/polkadot-js/phishing/pull/${url_data.pull_request_id}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {url_data.pull_request_id}
                        </a>
                      ) : (
                        <Typography>NA</Typography>
                      )}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="domain-name"
                      align="left"
                    >
                      <a
                        href={isValidHttpUrl(url_data.domainname) as string}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {extractDomainName(url_data.domainname)}
                      </a>
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="urlscan-or-image-proof"
                      align="left"
                    >
                      {url_data.proof !== null ? (
                        <a href={url_data.proof} target="_blank" rel="noreferrer noopener">
                          Image / urlscan proof
                        </a>
                      ) : (
                        <Typography>NA</Typography>
                      )}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="taken-down-status"
                      align="center"
                    >
                      {url_data.takendown ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="confirmed-takendown"
                      align="center"
                    >
                      {url_data.confirmed_takendown ? (
                        <span role="img" aria-label="checked">
                          ✅
                        </span>
                      ) : (
                        <span role="img" aria-label="unckecked">
                          ❌
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="eligible-submissions"
                      align="center"
                    >
                      {url_data.eligible === null
                        ? 'NA'
                        : url_data.eligible === true
                        ? 'Yes'
                        : 'No'}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="comments"
                      align="center"
                    >
                      <IconButton
                        disabled={comments === null || comments.length === 0 ? true : false}
                        color="primary"
                        aria-label="open comment dialog"
                        onClick={() => handleOpenCommentDialog(comments, url_data.domainname)}
                      >
                        <ChatBubbleIcon />
                      </IconButton>
                    </TableCell>
                    {session?.user.user_roles.some(e => e.role_id === ROLE_ID.Implementor) &&
                      (session?.user.id as unknown as number) === url_data.submitted_by && (
                        <TableCell
                          id="link-action"
                          className="hidden group-hover:inline-block group-hover:blur-0 group-hover:border-b-0"
                        >
                          <button
                            onClick={() => handleGoToForm('/implementers/edit/', url_data.id)}
                          >
                            Edit
                          </button>
                        </TableCell>
                      )}

                    {session?.user.user_roles.some(
                      e =>
                        e.role_id === ROLE_ID.Child_Curator ||
                        e.role_id === ROLE_ID.General_Curator,
                    ) && (
                      <TableCell
                        id="link-action"
                        className="hidden group-hover:inline-block group-hover:blur-0 group-hover:border-b-0"
                      >
                        <button onClick={() => handleGoToForm('/curators/edit/', url_data.id)}>
                          Curate
                        </button>
                      </TableCell>
                    )}
                    {!session?.user && <></>}
                  </TableRow>
                ))
              : null}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={10}
                count={submissions?.length ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <CommentDialog
        comments={comments}
        referencedUrl={referencedUrl}
        open={openCommentDialog}
        onClose={handleCloseCommentDialog}
      />
    </>
  );
};

export default OverviewTable;
